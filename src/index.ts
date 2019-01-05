/* tslint:disable:no-expression-statement */
import { log } from "fp-ts/lib/Console";
import { fromNullable } from "fp-ts/lib/Option";
import { prompt } from "prompts";
import { checkArgs, checkPathsInequality, checkPathSource, checkPathTarget } from "./check";
import { logErrors, logInfos, logSuccesses } from "./log";
import { comparePathHashLists, copyFiles, mkPathHashList, walkSync } from "./work";

/**
 * Main program.
 * Terminal usage example: `npm start ~/Documents/source ~/Documents/target`
 */
export const main = (args: ReadonlyArray<string>) =>
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
                  log(
                    `file-importer: info: ${
                      include.length
                    } new files has been found. Do you want to copy them to \`target\` directory?`
                  ).run();
                  logInfos(include.map(x => x.path));

                  const response =
                    process.env.NODE_ENV === "test"
                      ? { value: true }
                      : await prompt({
                          type: "confirm",
                          name: "value",
                          message: "file-importer: info: Can you confirm?",
                          initial: true
                        });
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

main(process.argv);
