/* tslint:disable:no-expression-statement */
import { fromNullable } from "fp-ts/lib/Option";
import { prompt, PromptObject } from "prompts";
import { checkArgs, checkPathsInequality, checkPathSource, checkPathTarget } from "./check";
import { logErrors, logInfos, logReport, logSuccesses, withPrefixInfo } from "./log";
import { PathHashList } from "./types";
import { comparePathHashLists, copyFiles, mkPathHashList, walkSync } from "./work";

export const PROMPT_CONFIG: PromptObject = {
  type: "confirm",
  name: "value",
  message: withPrefixInfo("Can you confirm?"),
  initial: false
};
/**
 * Report files asking a confirmation, if positive copy new files to `target`.
 */
export const promptConfirmationCopy = async (
  sourcePathHashList: PathHashList,
  targetPathHashList: PathHashList,
  targetResolved: string,
  promptConfig: PromptObject,
  env?: string
) => {
  const { include, exclude } = comparePathHashLists(sourcePathHashList, targetPathHashList);
  logReport(include);
  /* istanbul ignore next */
  const response = env === "test" ? { value: true } : await prompt(promptConfig);
  fromNullable(response.value).mapNullable(_r => {
    copyFiles(include, targetResolved).fold(logErrors, logSuccesses);
    logInfos(exclude.map(({ path }) => path));
  });
};

/**
 * Main program.
 * Terminal usage example: `npm start ~/Documents/source ~/Documents/target`
 */
export const main = (args: ReadonlyArray<string>, promptConfig: PromptObject, env?: string) =>
  checkArgs(args).fold(logErrors, ts => {
    checkPathsInequality(ts).fold(logErrors, ({ source, target }) => {
      checkPathSource(source).fold(logErrors, sourceResolved => {
        checkPathTarget(target).fold(logErrors, targetResolved => {
          walkSync(sourceResolved).fold(logErrors, sourceWalked => {
            walkSync(targetResolved).fold(logErrors, targetWalked => {
              mkPathHashList(sourceWalked).fold(logErrors, sourcePathHashList => {
                mkPathHashList(targetWalked).fold(logErrors, targetPathHashList => {
                  promptConfirmationCopy(
                    sourcePathHashList,
                    targetPathHashList,
                    targetResolved,
                    promptConfig,
                    env
                  );
                });
              });
            });
          });
        });
      });
    });
  });

main(process.argv, PROMPT_CONFIG, process.env.NODE_ENV);
