import { identity } from "fp-ts/lib/function";
import { checkArgs, checkPathsUnequal } from "./check";
import { logError } from "./log";
import { Errors } from "./types";

const printErrors = (errors: Errors) => errors.forEach(x => logError(x).run());

const program = (args: ReadonlyArray<string>) =>
  checkArgs(args).fold(printErrors, x => checkPathsUnequal(x).fold(printErrors, identity));

// tslint:disable-next-line:no-expression-statement
program(process.argv);
