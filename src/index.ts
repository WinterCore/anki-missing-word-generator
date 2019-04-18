import "source-map-support/register";

import * as program      from "commander";
import * as path         from "path";
import chalk             from "chalk";
import {
    readFile,
    writeFile,
    access
} from "fs-extra";

import sentencesExtractor from "./senteces-extractor";

program
  .version("0.1.0")
  .option("-i, --input [filename]", "Input file")
  .option("-o, --output [filename]", "Output file")
  .option("-s, --include-subsenses", "Include the subsenses in the output data")
  .option("-c, --count [number]", "The number of examples to extract for each definition (sense)")
  .option("-k, --app-key [key]", "An Oxford Dictionaries api key (you can get it from https://developer.oxforddictionaries.com)")
  .option("-d, --app-id [key]", "An Oxford Dictionaries app id (you can get it from https://developer.oxforddictionaries.com)")
  .option("-f, --using-free-plan", "Use this if you're using the free plan of the oxford dictionaries api (it throttles requests to prevent reaching the maximum of 60 per second)")
  .parse(process.argv);

if (!program.input) {
    console.log(chalk.red("No input file was specified"));
    process.exit();
}
if (!program.output) {
    console.log(chalk.red("No output file was specified"));
    process.exit();
}
if (!program.appKey) {
    console.log(chalk.red("No oxford api key was provided"));
}
if (!program.appId) {
    console.log(chalk.red("No oxford api key was provided"));
}

main().catch(console.log);

async function main() {
    let fileData: string;

    try {
        await access(path.dirname(program.output));
    } catch (e) {
        return console.log(chalk.red(`Output folder ${path.dirname(program.output)} is not writable`));
    }

    try {
        fileData = await readFile(program.input, "utf-8");
    } catch (e) {
        return console.log(chalk.red(`Input file ${chalk.yellow(path.resolve(program.input))} is not readable`));
    }

    const words: string[] = fileData.split("\n");
    
    if (!words.length) return console.log(chalk.red("No words were found in the file."));

    const output = await sentencesExtractor({
        words            : words,
        count            : program.count,
        includeSubsenses : program.includeSubsenses,
        appKey           : program.appKey,
        throttle         : program.usingFreePlan,
        appId            : program.appId
    });
    
    await writeFile(program.output, output);
    console.log(chalk.green(`File was saved successfully to ${chalk.yellow(program.output)}`));
}
