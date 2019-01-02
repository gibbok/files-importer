import { Either, left, right } from "fp-ts/lib/Either";
import { curry, not } from "fp-ts/lib/function";
import { pathExistsSync } from "fs-extra";
import * as nodePath from "path";
import { Errors, PathSourceTarget } from "./types";

/**
 * Check for the presence of two required arguments `source` and `target`.
 *
 * @param args - The arguments passed from the terminal
 * @returns An object which properties `source` and `target`
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
 *
 * @param pathSourceTarget - An object which properties `source` and `target`
 * @returns if `right` returns `pathSourceTarget` otherwise an error message
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
 *
 * @param type - The `path` type to check which can be `source` or `target`
 * @param path - The `path` to validate
 * @returns if `right` returns the `path` resolved otherwise an error message
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
 * Check `source` path is valid.
 *
 * @param type - The `path` type to check which can be `source` or `target`
 * @returns if `right` returns the `path` resolved otherwise an error message
 */
export const checkPathSource = checkPath("source");

/**
 * Check `target` path is valid.
 *
 * @param type - The `path` type to check which can be `source` or `target`
 * @returns if `right` returns the `path` resolved otherwise an error message
 */
export const checkPathTarget = checkPath("target");
