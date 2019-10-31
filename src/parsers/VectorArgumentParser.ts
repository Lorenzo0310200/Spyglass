import { ArgumentParserResult, combineArgumentParserResult } from '../types/Parser'
import ArgumentParser from './ArgumentParser'
import ParsingError from '../types/ParsingError'
import StringReader from '../utils/StringReader'
import Vector, { VectorElement, ShouldCorrect } from '../types/Vector'

export default class VectorArgumentParser extends ArgumentParser<Vector> {
    static readonly LocalSymbol = '^'
    static readonly RelativeSymbol = '~'
    static readonly Sep = ' '

    readonly identity = 'vector'

    constructor(
        private readonly dimension: 2 | 3,
        private readonly shouldCorrect = true,
        private readonly allowLocal = true,
        private readonly allowRelative = true
    ) {
        super()
    }

    parse(reader: StringReader, cursor = -1): ArgumentParserResult<Vector> {
        const ans: ArgumentParserResult<Vector> = {
            // tslint:disable-next-line: prefer-object-spread
            data: Object.assign([], { [ShouldCorrect]: this.shouldCorrect }),
            completions: [],
            errors: [],
            cache: {}
        }
        const start = reader.cursor

        if (reader.canRead()) {
            let dimension: number = this.dimension
            let hasLocal = false
            let hasNonLocal = false
            try {
                while (dimension) {
                    const result = this.parseElement(reader, cursor)
                    ans.data.push(result.data)
                    combineArgumentParserResult(ans, result)

                    hasLocal = hasLocal || result.data.type === 'local'
                    hasNonLocal = hasNonLocal || result.data.type !== 'local'

                    if (--dimension) {
                        reader
                            .expect(VectorArgumentParser.Sep)
                            .skip()
                    }
                }
            } catch (p) {
                ans.errors.push(p)
            }

            if (hasLocal && hasNonLocal) {
                ans.errors.push(new ParsingError(
                    { start, end: reader.cursor },
                    'cannot mix local coordinates and non-local coordinates together'
                ))
            }
        } else {
            ans.errors.push(new ParsingError(
                { start, end: start + 1 },
                'expected a vector but got nothing',
                false
            ))
            if (cursor === start) {
                this.getCompletionsForSymbols(ans)
            }
        }

        return ans
    }

    private parseElement(reader: StringReader, cursor :number) {
        const ans: ArgumentParserResult<VectorElement> = {
            data: { value: 0, type: 'absolute', hasDot: false },
            completions: [],
            errors: [],
            cache: {}
        }
        const start = reader.cursor

        if (cursor === reader.cursor) {
            this.getCompletionsForSymbols(ans)
        }

        if (reader.peek() === VectorArgumentParser.LocalSymbol) {
            reader.skip()
            ans.data.type = 'local'
        } else if (reader.peek() === VectorArgumentParser.RelativeSymbol) {
            reader.skip()
            ans.data.type = 'relative'
        }

        if (StringReader.canInNumber(reader.peek())) {
            try {
                const str = reader.readNumber()
                ans.data.hasDot = !str.includes('.')
                ans.data.value = parseFloat(str)
            } catch (p) {
                ans.errors.push(p)
            }
        }

        if (!this.allowLocal && ans.data.type === 'local') {
            ans.errors.push(new ParsingError(
                { start, end: reader.cursor },
                `local coordinate ‘${VectorArgumentParser.LocalSymbol}${ans.data.value}’ is not allowed`
            ))
        } else if (!this.allowRelative && ans.data.type === 'relative') {
            ans.errors.push(new ParsingError(
                { start, end: reader.cursor },
                `relative coordinate ‘${VectorArgumentParser.RelativeSymbol}${ans.data.value}’ is not allowed`
            ))
        }

        return ans
    }

    private getCompletionsForSymbols(ans: ArgumentParserResult<any>) {
        if (this.allowLocal) {
            ans.completions.push({ label: VectorArgumentParser.LocalSymbol })
        }
        if (this.allowRelative) {
            ans.completions.push({ label: VectorArgumentParser.RelativeSymbol })
        }
    }

    getExamples(): string[] {
        if (this.dimension === 2) {
            return ['0 0', '~ ~', '0.1 -0.5', '~1 ~-2']
        } else {
            return ['0 0 0', '~ ~ ~', '^ ^ ^', '^1 ^ ^-5', '0.1 -0.5 .9', '~0.5 ~1 ~-5']
        }
    }
}
