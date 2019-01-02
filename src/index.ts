/* tslint:disable:no-expression-statement */
import { checkArgs, checkPathsInequality, checkPathSource, checkPathTarget } from "./check";
import { logErrors, logInfos, logSuccesses } from "./log";
import { comparePathHashLists, copyFiles, mkPathHashList, walkSync } from "./work";

/**
 * Main program.
 * Use in terminal example: `npm start ~/Documents/source ~/Documents/target`
 */
export const main = (args: ReadonlyArray<string>) =>
  checkArgs(args).fold(logErrors, ts => {
    checkPathsInequality(ts).fold(logErrors, ({ source, target }) => {
      checkPathSource(source).fold(logErrors, sourceResolved => {
        checkPathTarget(target).fold(logErrors, targetResolved => {
          walkSync(sourceResolved).fold(logErrors, sourceWalked => {
            walkSync(targetResolved).fold(logErrors, targetWalked => {
              mkPathHashList(sourceWalked).fold(logErrors, sourcePathHashList => {
                mkPathHashList(targetWalked).fold(logErrors, targetPathHashList => {
                  const { include, exclude } = comparePathHashLists(
                    sourcePathHashList,
                    targetPathHashList
                  );
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

main(process.argv);
