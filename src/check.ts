import { Either, left, right } from "fp-ts/lib/Either";
import { curry, not } from "fp-ts/lib/function";
import { pathExistsSync } from "fs-extra";
import * as nodePath from "path";
import { Errors, PathSourceTarget } from "./types";

/**
 * Check for the presence of two required arguments `source` and `target`.
 */
export const checkArgs = (args: ReadonlyArray<string>): Either<Errors, PathSourceTarget> =>
  args.length !== 4
    ? left(["arguments are invalid, only two arguments `source` and `target` are allowed"])
    : right({
        source: args[2],
        target: args[3]
      });

/**
 * Compare for inequality properties `source` and `target`.
 */
export const checkPathsInequality = (
  pathSourceTarget: PathSourceTarget
): Either<Errors, PathSourceTarget> => {
  const { source, target } = pathSourceTarget;
  return source === target
    ? left(["arguments are invalid, arguments `source` and `target` paths must be different"])
    : right(pathSourceTarget);
};

/**
 * Check if the `path` provided is valid.
 */
export const checkPath = curry(
  (type: "source" | "target", path: string): Either<Errors, string> => {
    const pathResolved = nodePath.resolve(path);
    return not(pathExistsSync)(pathResolved)
      ? left([`${type} path is invalid, make sure the provided path exists`])
      : right(pathResolved);
  }
);

/**
 * Check if the path `source` provided is valid.
 */
export const checkPathSource = checkPath("source");

/**
 * Check if the path `target` provided is valid.
 */
export const checkPathTarget = checkPath("target");
