/// <reference path="index.d.ts" />

export default function normalize(entries: any, includeSubsenses: boolean): WordDocument[] {
    const { results : [{ id : word, lexicalEntries }] } = entries;
    const wordDocuments: WordDocument[] = [];

    lexicalEntries.forEach(({ lexicalCategory, entries }) => {
        entries.forEach(({ senses }) => {
            senses.forEach(({ definitions, id, subsenses }) => {
                if (!definitions) return;
                wordDocuments.push({
                    definitions : definitions.join(", "),
                    type : lexicalCategory,
                    word,
                    id
                });
                if (includeSubsenses && subsenses && subsenses.length) {
                    subsenses.forEach(({ definitions, id }) => {
                        wordDocuments.push({
                            definitions : definitions.join(", "),
                            type : lexicalCategory,
                            word,
                            id
                        });
                    });
                }
            });
        });
    });
    return wordDocuments;
}