/* tslint:disable:no-expression-statement */
import { PromptObject } from "prompts";
import * as readline from "readline";
import { checkArgs, checkPathsInequality, checkPathSource, checkPathTarget } from "./check";
import { logErrors, logInfos, logReport, logSuccesses, withPrefixInfo } from "./log";
import { PathHash, PathHashList } from "./types";
import { comparePathHashLists, copyFiles, mkPathHashList, walkSync } from "./work";

export const PROMPT_CONFIG: PromptObject = {
  type: "confirm",
  name: "value",
  message: withPrefixInfo("Can you confirm?"),
  initial: false
};

export const getUserInput = (fn: () => void) => {
  const { stdin, stdout } = process;
  const rl = readline.createInterface({ input: stdin, output: stdout });
  rl.question(withPrefixInfo("Can you confirm? Y/N"), (answer: string) => {
    withPrefixInfo(answer);
    // tslint:disable-next-line:no-if-statement
    if (answer.toLowerCase() === "y") {
      fn();
    }
    rl.close();
  });
};

const copyAndReport = (include: PathHashList, exclude: PathHashList, target: string) => {
  copyFiles(include, target).fold(logErrors, logSuccesses);
  logInfos(exclude.map((x: PathHash) => x.path));
};

/**
 * Main program.
 * Terminal usage example: `npm start ~/Documents/source ~/Documents/target`
 */
export const main = (args: ReadonlyArray<string>, nodeEnv?: string) =>
  checkArgs(args).fold(logErrors, ts => {
    checkPathsInequality(ts).fold(logErrors, ({ source, target }) => {
      checkPathSource(source).fold(logErrors, sourceResolved => {
        checkPathTarget(target).fold(logErrors, targetResolved => {
          walkSync(sourceResolved).fold(logErrors, sourceWalked => {
            walkSync(targetResolved).fold(logErrors, targetWalked => {
              mkPathHashList(sourceWalked).fold(logErrors, sourcePathHashList => {
                mkPathHashList(targetWalked).fold(logErrors, async targetPathHashList => {
                  const { include, exclude } = comparePathHashLists(
                    sourcePathHashList,
                    targetPathHashList
                  );
                  logReport(include);
                  const test = () => copyAndReport(include, exclude, targetResolved);
                  nodeEnv === "test" ? test() : getUserInput(test);
                });
              });
            });
          });
        });
      });
    });
  });

main(process.argv, process.env.NODE_ENV);
