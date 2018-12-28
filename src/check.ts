import { Either, left, right } from "fp-ts/lib/Either";
import { not } from "fp-ts/lib/function";
import { pathExistsSync } from "fs-extra";
import { Errors } from "./types";

export const checkArgs = (args: ReadonlyArray<string>): Either<Errors, ReadonlyArray<string>> =>
  args.length !== 4
    ? left(["arguments are invalid, only two arguments source and target are allowed"])
    : right(args);

export const checkPathsUnequal = (
  args: ReadonlyArray<string>
): Either<Errors, ReadonlyArray<string>> => {
  const [, , source, target] = args;
  return source === target
    ? left(["arguments are invalid, arguments source and target paths must be different"])
    : right([source, target]);
};

export const checkPath = (path: string): Either<Errors, string> => {
  return not(pathExistsSync)(path) ? left(["path is invalid"]) : right(path);
};
