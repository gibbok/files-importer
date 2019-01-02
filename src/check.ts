import { Either, left, right } from "fp-ts/lib/Either";
import { curry, not } from "fp-ts/lib/function";
import { pathExistsSync } from "fs-extra";
import * as nodePath from "path";
import { Errors, PathSourceTarget } from "./types";

export const checkArgs = (args: ReadonlyArray<string>): Either<Errors, PathSourceTarget> =>
  args.length !== 4
    ? left(["arguments are invalid, only two arguments `source` and `target` are allowed"])
    : right({
        source: args[2],
        target: args[3]
      });

export const checkPathsInequality = (
  pathSourceTarget: PathSourceTarget
): Either<Errors, PathSourceTarget> => {
  const { source, target } = pathSourceTarget;
  return source === target
    ? left(["arguments are invalid, arguments `source` and `target` paths must be different"])
    : right(pathSourceTarget);
};

export const checkPath = curry(
  (type: "source" | "target", path: string): Either<Errors, string> => {
    const pathResolved = nodePath.resolve(path);
    return not(pathExistsSync)(pathResolved)
      ? left([`${type} path is invalid, make sure the provided path exists`])
      : right(pathResolved);
  }
);

export const checkPathSource = checkPath("source");

export const checkPathTarget = checkPath("target");
