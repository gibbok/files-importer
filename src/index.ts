/* tslint:disable:no-expression-statement */
import { checkArgs, checkPath, checkPathsUnequal } from "./check";
import { logError, logSuccess } from "./log";
import { Errors } from "./types";
import { comparePathHashLists, copyFiles, mkPathHashList, walkSync } from "./work";

const printErrors = (errors: Errors) => errors.forEach(x => logError(x).run());

const printSuccess = (successes: ReadonlyArray<string>) =>
  successes.forEach(x => logSuccess(x).run());

const printMessages = (messages: ReadonlyArray<string>) => messages.forEach(console.log);

const program = (args: ReadonlyArray<string>) =>
  checkArgs(args).fold(printErrors, ts =>
    checkPathsUnequal(ts).fold(printErrors, ({ target, source }) => {
      checkPath(target).fold(printErrors, targetOk =>
        checkPath(source).fold(printErrors, sourceOk => {
          walkSync(targetOk).fold(printErrors, targetWalked =>
            walkSync(sourceOk).fold(printErrors, sourceWalked => {
              mkPathHashList(targetWalked).fold(printErrors, targetPathHashList => {
                mkPathHashList(sourceWalked).fold(printErrors, sourcePathHashList => {
                  const { include, exclude } = comparePathHashLists(
                    sourcePathHashList,
                    targetPathHashList
                  );
                  copyFiles(include, target).fold(printErrors, printSuccess);
                  printMessages(exclude.map(x => x.path));
                });
              });
            })
          );
        })
      );
    })
  );

program(process.argv);
