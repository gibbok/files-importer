import { Either, left, right } from "fp-ts/lib/Either";
import { not } from "fp-ts/lib/function";
import { pathExistsSync } from "fs-extra";

export const checkArgs = (
  args: ReadonlyArray<string>
): Either<string, ReadonlyArray<string>> =>
  args.length !== 4
    ? left("ony two arguments source and target are allowed")
    : right(args);

export const checkPathsUnequal = (
  args: ReadonlyArray<string>
): Either<string, ReadonlyArray<string>> => {
  const [, , source, target] = args;
  return source === target
    ? left("source and target paths must be different")
    : right([source, target]);
};

export const checkPath = (path: string): Either<string, string> => {
  return not(pathExistsSync)(path) ? left("path is invalid") : right(path);
};
