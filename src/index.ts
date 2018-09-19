import { Either, left, right } from "fp-ts/lib/Either";
import { error } from "fp-ts/lib/Exception";
import { curry } from "fp-ts/lib/function";
import { IO } from "fp-ts/lib/IO";
import { fromEither, IOEither } from "fp-ts/lib/IOEither";
import { pathExistsSync } from "fs-extra";
import klawSync from "klaw-sync";

export const pathExist = (path: string): IOEither<Error, string> =>
  fromEither(
    pathExistsSync(path) ? right(path) : left(error("path is invalid"))
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

// export const comparePaths = curry((targetPath: string, sourcePath: string) => {
//   const result = isTargetDifferentFromSourcePath(targetPath)(sourcePath)
//     .chain(() => pathExist(targetPath))
//     .chain(() => pathExist(sourcePath));
//   return result;
// });

// const args = process.argv;
// const program = () => comparePaths(args[3])(args[4]);

// tslint:disable-next-line:no-expression-statement
// program();
