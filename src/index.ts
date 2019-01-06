/* tslint:disable:no-expression-statement */
import { fromNullable } from "fp-ts/lib/Option";
import { prompt, PromptObject } from "prompts";
import { checkArgs, checkPathsInequality, checkPathSource, checkPathTarget } from "./check";
import { logErrors, logInfos, logReport, logSuccesses, withPrefixInfo } from "./log";
import { comparePathHashLists, copyFiles, mkPathHashList, walkSync } from "./work";

export const PROMPT_CONFIG: PromptObject = {
  type: "confirm",
  name: "value",
  message: withPrefixInfo("Can you confirm?"),
  initial: false
};

/**
 * Main program.
 * Terminal usage example: `npm start ~/Documents/source ~/Documents/target`
 */
export const main = (args: ReadonlyArray<string>, promptConfig: PromptObject, nodeEnv?: string) =>
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
                  const response: { value: boolean } =
                    nodeEnv === "test" ? { value: true } : await prompt(promptConfig);
                  fromNullable(response.value).mapNullable(_x => {
                    copyFiles(include, targetResolved).fold(logErrors, logSuccesses);
                    logInfos(exclude.map(x => x.path));
                  });
                });
              });
            });
          });
        });
      });
    });
  });

main(process.argv, PROMPT_CONFIG, process.env.NODE_ENV);
