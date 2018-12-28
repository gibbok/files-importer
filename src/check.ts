import { Either, left, right } from "fp-ts/lib/Either";
import { not } from "fp-ts/lib/function";
import { pathExistsSync } from "fs-extra";
import { Errors, PathSourceTarget } from "./types";

export const checkArgs = (args: ReadonlyArray<string>): Either<Errors, PathSourceTarget> =>
  args.length !== 4
    ? left(["arguments are invalid, only two arguments source and target are allowed"])
    : right({
        source: args[2],
        target: args[3]
      });

export const checkPathsUnequal = (
  pathSourceTarget: PathSourceTarget
): Either<Errors, PathSourceTarget> => {
  const { source, target } = pathSourceTarget;
  return source === target
    ? left(["arguments are invalid, arguments source and target paths must be different"])
    : right(pathSourceTarget);
};

export const checkPath = (path: string): Either<Errors, string> => {
  return not(pathExistsSync)(path) ? left(["path is invalid"]) : right(path);
};
