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
  checkArgs(args)
    .chain(pathsSourceTarget => checkPathsInequality(pathsSourceTarget))
    .map(({ source, target }) => {
      checkPathSource(source)
        .chain(sourceResolved => walkSync(sourceResolved))
        .chain(sourceWalked => mkPathHashList(sourceWalked))
        .fold(logErrors, sourcePathHashList =>
          checkPathTarget(target)
            .chain(targetResolved => walkSync(targetResolved))
            .chain(targetWalked => mkPathHashList(targetWalked))
            .fold(logErrors, async targetPathHashList => {
              checkPathTarget(target).map(async targetResolved => {
                await promptConfirmationCopy(
                  sourcePathHashList,
                  targetPathHashList,
                  targetResolved,
                  promptConfig,
                  env
                );
              });
            })
        );
    });

main(process.argv, PROMPT_CONFIG, process.env.NODE_ENV);
