import chalk            from "chalk";
import * as ProgressBar from "progress";

import fetch      from "./fetch";
import normalize  from "./normalize";
import examplify  from "./examplify";

import * as R from "ramda";

function createDefinitionCards({ definitions, examples, word, type }: MissingWordDocument): string {
    return examples.map(example => {
        const front = `<div>${example}</div><br/><div><b>[${type}]</b></div><div>${definitions}</div>`;
        const back  = `<div>${word}</div>`;
        return `${front};${back}`;
    }).join("\n");
}

const blankDocumentExamples = (doc: MissingWordDocument) =>
    doc.examples.map(example => example.replace(new RegExp(`${doc.word}(?:ed|ied|s|es|ies|ing)?`, "i"), "_".repeat(doc.word.length)));

const wait = ms => new Promise((resolve) => setTimeout(resolve, ms));

export default async function getDefinitions({
    words,
    appId,
    appKey,
    throttle,
    count = 2,
    includeSubsenses = false
}: args) {

    const progressBar = new ProgressBar(`Fetching data ${chalk.green("[:bar]")} ${chalk.yellow(":word")}`, {
        total : words.length,
        width : 30
    });

    let notFoundDefinitions               = [];
    let outputData: MissingWordDocument[] = [];
    let lastRequestTimestamp              = Date.now();

    for (const word of words) {
        if (throttle) {
            if (Date.now() - lastRequestTimestamp < 2000)
                await wait(2010 - (Date.now() - lastRequestTimestamp));
            lastRequestTimestamp = Date.now();
        }

        const trimmedWord = word.trim().toLowerCase();
        let data = null;
        try {
            data = await fetch(trimmedWord, { appId, appKey });
        } catch (e) {
            notFoundDefinitions.push(trimmedWord);
            continue;
        }
        const [entries, sentences] = data;
        const wordDocuments: WordDocument[] = normalize(entries, includeSubsenses);

        const assocSentences = R.converge(R.assoc("examples"), [examplify(sentences, count), R.identity]);
        const blankWords     = R.converge(R.assoc("examples"), [blankDocumentExamples, R.identity]);

        const missingWordDocuments: MissingWordDocument[] = R.map(R.compose(blankWords, assocSentences))(wordDocuments);
        outputData = outputData.concat(missingWordDocuments);
        progressBar.tick({ word : trimmedWord });
    }

    if (notFoundDefinitions.length) {
        console.log();
        console.log(chalk.red("No data was found for the following words"))
        console.log(chalk.yellow(notFoundDefinitions.join(", ")));
        console.log();
    }

    return R.compose(R.join("\n"), R.map(createDefinitionCards))(outputData);
}