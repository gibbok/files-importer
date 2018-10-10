import { Either, left, right } from "fp-ts/lib/Either";
import { not } from "fp-ts/lib/function";
import { IO } from "fp-ts/lib/IO";
import { pathExistsSync } from "fs-extra";
import { logError } from "./log";

export const checkArgs = (
  args: ReadonlyArray<string>
): Either<IO<void>, ReadonlyArray<string>> =>
  args.length !== 4
    ? left(logError("ony source and target arguments are allowed"))
    : right(args);

export const checkPathsUnequal = (
  args: ReadonlyArray<string>
): Either<IO<void>, ReadonlyArray<string>> => {
  const [, , source, target] = args;
  return source === target
    ? left(logError("source and target paths must be different"))
    : right([source, target]);
};

export const checkPath = (path: string): Either<IO<void>, string> => {
  return not(pathExistsSync)(path)
    ? left(logError("path is invalid"))
    : right(path);
};
