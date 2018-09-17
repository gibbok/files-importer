import { Either, left, Left, right, Right } from "fp-ts/lib/Either";
import { error } from "fp-ts/lib/Exception";
import { Curried2, curry } from "fp-ts/lib/function";
import { IO } from "fp-ts/lib/IO";
import { pathExistsSync } from "fs-extra";
import klawSync from "klaw-sync";

// @ts-ignore
const log = <T>(obj: T): IO<void> => new IO(() => console.log(obj));

export const pathExist = (path: string): IO<Either<Error, boolean>> =>
  new IO(
    () =>
      !pathExistsSync(path) ? left(error("error path invalid")) : right(true)
  );

export const walkSync = (
  path: string
): IO<Either<Error, ReadonlyArray<klawSync.Item>>> => {
  return new IO(() => {
    try {
      return right(klawSync(path, { nodir: true }));
    } catch {
      return left(error("error cannot walk"));
    }
  });
};

export const isTargetDifferentFromSourcePath = curry(
  (targetPath: string, destinationPath: string) =>
    targetPath === destinationPath ? left(error("error")) : right(true)
);

export const comparePaths = curry((targetPath: string, sourcePath: string) => {
  const result = isTargetDifferentFromSourcePath(targetPath)(sourcePath)
    .chain(() => pathExist(targetPath))
    .chain(() => pathExist(sourcePath));
  return result;
});

const args = process.argv;
console.log(args);
console.log("runs!");
const program = () => comparePaths(args[3])(args[4]);

// tslint:disable-next-line:no-expression-statement
program();
