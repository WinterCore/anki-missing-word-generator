/// <reference path="index.d.ts" />
import { curry, pipe, map, filter, prop, take } from "ramda";

function examplify(sentences: any, count: number, { id, type }: WordDocument): string[] {
    const { results : [{ lexicalEntries }] } = sentences;

    const lexicalCategory: any = lexicalEntries.filter(({ lexicalCategory }) => lexicalCategory === type)[0];

    if (!lexicalCategory) return [];

    const filterById = ({ senseIds }): boolean => senseIds.indexOf(id) > -1;

    return pipe(
        filter(filterById),
        // @ts-ignore
        // There's an error with ramda's typescript typings for map when used with filter
        map(prop("text")),
        take(Math.min(lexicalCategory.sentences.length, count)),
    )(lexicalCategory.sentences);
}

export default curry(examplify);