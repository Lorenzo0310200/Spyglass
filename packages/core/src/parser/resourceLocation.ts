import { arrayToMessage, localize } from '@spyglassmc/locales'
import type { Mutable } from '../node'
import { ResourceLocationNode } from '../node'
import type { ParserContext } from '../service'
import type { Source } from '../source'
import { Range } from '../source'
import type { ResourceLocationCategory, TagResourceLocationCategory } from '../symbol'
import type { InfallibleParser } from './Parser'

const Pattern = /^(?:[_\-a-z0-9.]*:)?[_\-a-z0-9/.]*$/g
const IllegalNamespacePattern = /[^_\-a-z0-9.]/g
const IllegalPathPattern = /[^_\-a-z0-9/.]/g

/**
 * @internal Exported for tests only.
 */
export type Options = {
	category: ResourceLocationCategory,
	pool?: undefined,
	allowTag?: false,
} | {
	category: TagResourceLocationCategory,
	pool?: undefined,
	allowTag?: boolean,
} | {
	category?: undefined,
	pool: string[],
	allowTag?: false,
}

export function resourceLocation(options: Options): InfallibleParser<ResourceLocationNode> {
	return (src: Source, ctx: ParserContext): ResourceLocationNode => {
		const ans: Mutable<ResourceLocationNode> = {
			type: 'resource_location',
			range: Range.create(src),
			category: options.category,
		}

		if (src.trySkip(ResourceLocationNode.TagPrefix)) {
			ans.isTag = true
		}

		const raw = src.readUntilOrEnd(' ', '\r', '\n')
		ans.range.end = src.cursor

		if (raw.length === 0) {
			ctx.err.report(localize('expected', localize('resource-location')), ans)
		} else {
			const sepIndex = raw.indexOf(ResourceLocationNode.NamespacePathSep)
			if (sepIndex >= 0) {
				ans.namespace = raw.slice(0, sepIndex)
			}
			const rawPath = raw.slice(sepIndex + 1)
			ans.path = rawPath.split(ResourceLocationNode.PathSep)

			// Check characters.
			if (!raw.match(Pattern)) {
				/* istanbul ignore next */
				const chars = [...new Set([
					...ans.namespace?.matchAll(IllegalNamespacePattern) ?? [],
					...rawPath.matchAll(IllegalPathPattern),
				].map(v => v[0]))]
				ctx.err.report(localize('parser.resource-location.illegal', arrayToMessage(chars, true, 'and')), ans)
			}

			if (ans.isTag && !options.allowTag) {
				ctx.err.report(localize('parser.resource-location.tag-diallowed'), ans)
			}
		}

		// TODO: Check the resource location if `pool` exists.

		return ans
	}
}