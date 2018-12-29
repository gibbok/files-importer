/* tslint:disable:no-expression-statement */
import { checkArgs, checkPath, checkPathsUnequal } from "./check";
import { logError, logInfo, logMessages, logSuccess } from "./log";
import { comparePathHashLists, copyFiles, mkPathHashList, walkSync } from "./work";

const logErrors = logMessages(logError);

const logSuccesses = logMessages(logSuccess);

const logInfos = logMessages(logInfo);

const program = (args: ReadonlyArray<string>) =>
  checkArgs(args).fold(logErrors, ts =>
    checkPathsUnequal(ts).fold(logErrors, ({ source, target }) => {
      checkPath(source).fold(logErrors, sourceOk => {
        checkPath(target).fold(logErrors, targetOk => {
          walkSync(sourceOk).fold(logErrors, sourceWalked => {
            walkSync(targetOk).fold(logErrors, targetWalked => {
              mkPathHashList(sourceWalked).fold(logErrors, sourcePathHashList => {
                mkPathHashList(targetWalked).fold(logErrors, targetPathHashList => {
                  const { include, exclude } = comparePathHashLists(
                    sourcePathHashList,
                    targetPathHashList
                  );
                  copyFiles(include, targetOk).fold(logErrors, logSuccesses);
                  logInfos(exclude.map(x => x.path));
                });
              });
            });
          });
        });
      });
    })
  );

program(process.argv);
