/* tslint:disable:no-expression-statement */
import { checkArgs, checkPath, checkPathsUnequal } from "./check";
import { logError } from "./log";
import { Errors } from "./types";
import { walkSync } from "./work";

const printErrors = (errors: Errors) => errors.forEach(x => logError(x).run());

const program = (args: ReadonlyArray<string>) =>
  checkArgs(args).fold(printErrors, ts =>
    checkPathsUnequal(ts).fold(printErrors, ({ target, source }) => {
      checkPath(target).fold(printErrors, targetOk =>
        checkPath(source).fold(printErrors, sourceOk => {
          walkSync(targetOk).fold(printErrors, _targetWalked =>
            walkSync(sourceOk).fold(printErrors, _sourceWalked => _sourceWalked)
          );
        })
      );
    })
  );

program(process.argv);
