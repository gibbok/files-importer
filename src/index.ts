/* tslint:disable:no-expression-statement */
import { checkArgs, checkPath, checkPathsUnequal } from "./check";
import { logError } from "./log";
import { Errors } from "./types";

const printErrors = (errors: Errors) => errors.forEach(x => logError(x).run());

const program = (args: ReadonlyArray<string>) =>
  checkArgs(args).fold(printErrors, ts =>
    checkPathsUnequal(ts).fold(printErrors, ({ target, source }) => {
      checkPath(target).fold(printErrors, _targetOk =>
        checkPath(source).fold(printErrors, _sourceOk => _sourceOk)
      );
    })
  );

program(process.argv);
