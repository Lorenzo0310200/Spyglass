/* istanbul ignore file */

import type { TextDocument } from 'vscode-languageserver-textdocument'
import type { LinterErrorReporter } from './index.mjs'
import { formatterContextIndentation } from '../processor/index.mjs'
import type { Range } from '../source/index.mjs'
import { ReadonlySource } from '../source/index.mjs'
import type { SymbolTable, SymbolUtil } from '../symbol/index.mjs'
import type { Config } from './Config.mjs'
import { ErrorReporter } from './ErrorReporter.mjs'
import type { FileService } from './FileService.mjs'
import type { RootUriString } from './fileUtil.mjs'
import type { Logger } from './Logger.mjs'
import type { MetaRegistry } from './MetaRegistry.mjs'
import { Operations } from './Operations.mjs'
import type { ProfilerFactory } from './Profiler.mjs'
import type { DocAndNode, ProjectData } from './Project.mjs'

export interface ContextBase {
	fs: FileService,
	getDocAndNode: (uri: string) => DocAndNode | undefined,
	global: SymbolTable,
	logger: Logger,
	meta: MetaRegistry,
	profilers: ProfilerFactory,
	project: Record<string, string>,
	roots: readonly RootUriString[],
}
export namespace ContextBase {
	export function create(project: ProjectData): ContextBase {
		return {
			fs: project.fs,
			getDocAndNode: project.get.bind(project),
			global: project.symbols.global,
			logger: project.logger,
			meta: project.meta,
			profilers: project.profilers,
			roots: project.roots,
			project: project.ctx,
		}
	}
}

export interface ParserContext extends ContextBase {
	config: Config,
	doc: TextDocument,
	err: ErrorReporter,
	symbols: SymbolUtil,
}
interface ParserContextOptions {
	doc: TextDocument,
	err?: ErrorReporter,
}
export namespace ParserContext {
	export function create(project: ProjectData, opts: ParserContextOptions): ParserContext {
		return {
			...ContextBase.create(project),
			config: project.config,
			doc: opts.doc,
			err: opts.err ?? new ErrorReporter(),
			symbols: project.symbols,
		}
	}
}

export interface ProcessorContext extends ContextBase {
	config: Config,
	doc: TextDocument,
	src: ReadonlySource,
	symbols: SymbolUtil,
}
interface ProcessorContextOptions {
	doc: TextDocument,
	src?: ReadonlySource,
}
export namespace ProcessorContext {
	export function create(project: ProjectData, opts: ProcessorContextOptions): ProcessorContext {
		return {
			...ContextBase.create(project),
			config: project.config,
			doc: opts.doc,
			src: opts.src ?? new ReadonlySource(opts.doc.getText()),
			symbols: project.symbols,
		}
	}
}

interface ProcessorWithRangeContext extends ProcessorContext {
	range?: Range,
}
interface ProcessorWithRangeContextOptions extends ProcessorContextOptions {
	range?: Range,
}
namespace ProcessorWithRangeContext {
	export function create(project: ProjectData, opts: ProcessorWithRangeContextOptions): ProcessorWithRangeContext {
		return {
			...ProcessorContext.create(project, opts),
			range: opts.range,
		}
	}
}

interface ProcessorWithOffsetContext extends ProcessorContext {
	offset: number,
}
interface ProcessorWithOffsetContextOptions extends ProcessorContextOptions {
	offset: number,
}
namespace ProcessorWithOffsetContext {
	export function create(project: ProjectData, opts: ProcessorWithOffsetContextOptions): ProcessorWithOffsetContext {
		return {
			...ProcessorContext.create(project, opts),
			offset: opts.offset,
		}
	}
}

export interface CheckerContext extends ProcessorContext {
	err: ErrorReporter,
	ops: Operations,
	ensureChecked: (this: void, uri: string) => Promise<unknown>,
}
interface CheckerContextOptions extends ProcessorContextOptions {
	err?: ErrorReporter,
	ops?: Operations,
}
export namespace CheckerContext {
	export function create(project: ProjectData, opts: CheckerContextOptions): CheckerContext {
		return {
			...ProcessorContext.create(project, opts),
			err: opts.err ?? new ErrorReporter(),
			ops: opts.ops ?? new Operations(),
			ensureChecked: project.ensureParsedAndChecked?.bind(project),
		}
	}
}

export interface LinterContext extends ProcessorContext {
	err: LinterErrorReporter,
	ruleName: string,
	ruleValue: unknown,
}
interface LinterContextOptions extends ProcessorContextOptions {
	err: LinterErrorReporter,
	ruleName: string,
	ruleValue: unknown,
}
export namespace LinterContext {
	export function create(project: ProjectData, opts: LinterContextOptions): LinterContext {
		return {
			...ProcessorContext.create(project, opts),
			err: opts.err,
			ruleName: opts.ruleName,
			ruleValue: opts.ruleValue,
		}
	}
}

export interface FormatterContext extends ProcessorContext {
	tabSize: number,
	insertSpaces: boolean,
	indentLevel: number,
	indent: (additionalLevels?: number) => string,
}
interface FormatterContextOptions extends ProcessorContextOptions {
	tabSize: number,
	insertSpaces: boolean,
}
export namespace FormatterContext {
	export function create(project: ProjectData, opts: FormatterContextOptions): FormatterContext {
		return {
			...ProcessorContext.create(project, opts),
			...opts,
			indentLevel: 0,
			indent(additionalLevels) {
				return formatterContextIndentation(this, additionalLevels)
			},
		}
	}
}

export interface ColorizerContext extends ProcessorWithRangeContext { }
export interface ColorizerContextOptions extends ProcessorWithRangeContextOptions { }
export namespace ColorizerContext {
	export function create(project: ProjectData, opts: ColorizerContextOptions): ColorizerContext {
		return ProcessorWithRangeContext.create(project, opts)
	}
}

export interface CompleterContext extends ProcessorContext {
	offset: number,
	triggerCharacter?: string,
}
interface CompleterContextOptions extends ProcessorContextOptions {
	offset: number,
	triggerCharacter?: string,
}
export namespace CompleterContext {
	export function create(project: ProjectData, opts: CompleterContextOptions): CompleterContext {
		return {
			...ProcessorContext.create(project, opts),
			offset: opts.offset,
			triggerCharacter: opts.triggerCharacter,
		}
	}
}

export interface SignatureHelpProviderContext extends ProcessorWithOffsetContext { }
export interface SignatureHelpProviderContextOptions extends ProcessorWithOffsetContextOptions { }
export namespace SignatureHelpProviderContext {
	export function create(project: ProjectData, opts: SignatureHelpProviderContextOptions): SignatureHelpProviderContext {
		return ProcessorWithOffsetContext.create(project, opts)
	}
}

export interface UriBinderContext extends ContextBase {
	/** @deprecated */
	symbols: SymbolUtil,
}
export namespace UriBinderContext {
	export function create(project: ProjectData): UriBinderContext {
		return {
			...ContextBase.create(project),
			symbols: project.symbols,
		}
	}
}