/* tslint:disable:no-expression-statement */
import { PromptObject } from "prompts";
import { checkArgs, checkPathsInequality, checkPathSource, checkPathTarget } from "./check";
import { logErrors, withPrefixInfo } from "./log";
import { mkPathHashList, promptConfirmationCopy, walkSync } from "./work";

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
export const main = (args: ReadonlyArray<string>, promptConfig: PromptObject, env?: string) =>
  checkArgs(args).fold(logErrors, ts => {
    checkPathsInequality(ts).fold(logErrors, ({ source, target }) => {
      checkPathSource(source).fold(logErrors, sourceResolved => {
        checkPathTarget(target).fold(logErrors, targetResolved => {
          walkSync(sourceResolved).fold(logErrors, sourceWalked => {
            walkSync(targetResolved).fold(logErrors, targetWalked => {
              mkPathHashList(sourceWalked).fold(logErrors, sourcePathHashList => {
                mkPathHashList(targetWalked).fold(logErrors, async targetPathHashList => {
                  await promptConfirmationCopy(
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
