import type { AstNode, CommentNode, ErrorNode, FloatBaseNode, IntegerBaseNode, ResourceLocationNode, StringBaseNode } from '../../node'
import { IndexMap, Range } from '../../source'
import { traversePreOrder } from '../util'
import type { Colorizer, ColorTokenType } from './Colorizer'
import { ColorToken } from './Colorizer'

/**
 * Combines the ColorToken provided by colorizers for the children closest to the root `node`
 * that have their own colorizer registered.
 */
export const fallback: Colorizer<AstNode> = (node, ctx) => {
	const ans: ColorToken[] = []
	traversePreOrder(node,
		node => !ctx.options.range || Range.intersects(node.range, ctx.options.range),
		node => ctx.meta.hasColorizer(node.type),
		node => {
			const colorizer = ctx.meta.getColorizer(node.type)
			const result = colorizer(node, ctx)
			ans.push(...result)
		}
	)
	return Object.freeze(ans)
}

export const comment: Colorizer<CommentNode> = node => {
	return [ColorToken.create(node, 'comment')]
}

export const error: Colorizer<ErrorNode> = node => {
	return [ColorToken.create(node, 'error')]
}

export const number: Colorizer<IntegerBaseNode | FloatBaseNode> = node => {
	return [ColorToken.create(node, 'number')]
}

export const resourceLocation: Colorizer<ResourceLocationNode> = (node, ctx) => {
	let type: ColorTokenType
	switch (node.category) {
		case 'function':
		case 'tag/function':
			type = 'function'
			break
		default:
			type = 'resourceLocation'
			break
	}
	return [ColorToken.create(node, type)]
}

export const string: Colorizer<StringBaseNode> = (node, ctx) => {
	if (node.valueNode) {
		const colorizer = ctx.meta.getColorizer(node.valueNode.type)
		const result = colorizer(node.valueNode, ctx)
		return ColorToken.fillGap(node.range, toOuterColorTokens(result, node.valueMap), 'string')
	} else {
		return [ColorToken.create(node, 'string')]
	}
}

function toOuterColorTokens(tokens: readonly ColorToken[], mapping: IndexMap): ColorToken[] {
	return tokens.map(token => ({
		...token,
		range: IndexMap.toOuterRange(mapping, token.range),
	}))
}