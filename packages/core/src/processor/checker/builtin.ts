import { localeQuote, localize } from '../../../../locales/lib'
import { ResourceLocation } from '../../common'
import type { AstNode, SymbolBaseNode, SymbolNode } from '../../node'
import { ResourceLocationNode } from '../../node'
import type { CheckerContext, MetaRegistry } from '../../service'
import { ErrorReporter, Operations } from '../../service'
import { ErrorSeverity } from '../../source'
import { SymbolAccessType } from '../../symbol'
import { traversePreOrder } from '../util'
import type { Checker, SyncChecker } from './Checker'

export type AttemptResult = {
	errorAmount: number,
	totalErrorSpan: number,
	updateNodeAndCtx: () => void,
}

export function attempt<N extends AstNode>(checker: Checker<N>, node: N, ctx: CheckerContext): AttemptResult {
	const tempCtx: CheckerContext = {
		...ctx,
		err: new ErrorReporter(),
		ops: new Operations(),
		symbols: ctx.symbols.clone(),
	}

	// FIXME: await
	checker(node, tempCtx)

	tempCtx.ops.undo()

	const totalErrorSpan = tempCtx.err.errors
		.map(e => e.range.end - e.range.start)
		.reduce((a, b) => a + b, 0)

	return {
		errorAmount: tempCtx.err.errors.length,
		totalErrorSpan,
		updateNodeAndCtx: () => {
			ctx.err.absorb(tempCtx.err)
			tempCtx.ops.redo()
			tempCtx.symbols.applyDelayedEdits()
		},
	}
}

export function any<N extends AstNode>(checkers: Checker<N>[]): Checker<N> {
	if (checkers.length === 0) {
		throw new Error('Expected at least one checker')
	}
	return (node, ctx) => {
		const attempts = checkers
			.map(checker => attempt(checker, node, ctx))
			.sort((a, b) => a.errorAmount - b.errorAmount || a.totalErrorSpan - b.totalErrorSpan)
		attempts[0].updateNodeAndCtx()
	}
}

/**
 * No operation.
 */
export const noop: SyncChecker<AstNode> = () => { }

/**
 * Use the shallowest children that have their own checker to validate.
 */
export const fallback: Checker<AstNode> = async (node, ctx) => {
	const promises: Promise<unknown>[] = []
	traversePreOrder(node,
		node => !ctx.meta.hasChecker(node.type),
		node => ctx.meta.hasChecker(node.type),
		node => {
			const checker = ctx.meta.getChecker(node.type)
			const result = checker(node, ctx)
			if (result instanceof Promise) {
				promises.push(result)
			}
		}
	)
	await Promise.allSettled(promises)
}

export const resourceLocation: Checker<ResourceLocationNode> = (node, ctx) => {
	const full = ResourceLocationNode.toString(node, 'full')
	if (node.options.pool) {
		if (!node.options.pool.includes(full)) {
			ctx.err.report(localize('expected', node.options.pool), node, ErrorSeverity.Error)
		}
		return
	}
	if (node.options.category) {
		const path = node.isTag ? full.slice(1) : full
		const category = node.isTag ? `tag/${node.options.category}` : node.options.category
		if (category === 'structure') return
		const query = ctx.symbols.query(ctx.doc, category, path)
		if (node.options.accessType === SymbolAccessType.Write) {
			query.enter({ usage: { type: 'definition', node } })
		} else {
			query.enter({ usage: { type: 'reference', node } })
			if (!node.options.allowUnknown) {
				query.ifDeclared(() => {}).else(() => {
					ctx.err.report(localize('resource-location.undeclared', category, localeQuote(full)), node, ErrorSeverity.Warning)
				})
			}
		}
	}
}

export const symbol: Checker<SymbolBaseNode> = (_node, _ctx) => {
	// TODO
}

export function registerCheckers(meta: MetaRegistry) {
	meta.registerChecker<ResourceLocationNode>('resource_location', resourceLocation)
	meta.registerChecker<SymbolNode>('symbol', symbol)
}

/**
 * @param ids An array of block/fluid IDs, with or without the namespace.
 * @returns A map from state names to the corresponding sets of values.
 */
export function getStates(category: 'block' | 'fluid', ids: readonly string[], ctx: CheckerContext): Record<string, readonly string[]> {
	const ans: Record<string, string[]> = {}
	ids = ids.map(ResourceLocation.lengthen)
	for (const id of ids) {
		ctx.symbols
			.query(ctx.doc, category, id)
			.forEachMember((state, stateQuery) => {
				const values = Object.keys(stateQuery.visibleMembers)
				const arr = ans[state] ??= []
				for (const value of values) {
					if (!arr.includes(value)) {
						arr.push(value)
					}
				}
			})
	}
	return ans
}