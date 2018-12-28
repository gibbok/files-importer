import { checkArgs, checkPath, checkPathsUnequal } from "./check";
import { logError } from "./log";
import { Errors } from "./types";

const printErrors = (errors: Errors) => errors.forEach(x => logError(x).run());

const program = (args: ReadonlyArray<string>) =>
  checkArgs(args).fold(printErrors, x =>
    checkPathsUnequal(x).fold(printErrors, y => {
      const target = checkPath(y.target);
      const source = checkPath(y.source);
      // tslint:disable-next-line:no-if-statement
      if (target.isRight() && source.isRight()) {
        // tslint:disable-next-line:no-expression-statement
        console.log("success");
      } else {
        const errorsTarget = target.isLeft() ? target.value : [];
        const errorsSource = source.isLeft() ? source.value : [];
        // tslint:disable-next-line:no-expression-statement
        printErrors(errorsTarget.concat(errorsSource));
      }
    })
  );

// tslint:disable-next-line:no-expression-statement
program(process.argv);
