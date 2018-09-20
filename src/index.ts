import { left, right } from "fp-ts/lib/Either";
import { error } from "fp-ts/lib/Exception";
import { curry } from "fp-ts/lib/function";
import { fromEither, IOEither, tryCatch } from "fp-ts/lib/IOEither";
import { pathExistsSync } from "fs-extra";
import klawSync from "klaw-sync";

export const pathExist = (path: string): IOEither<Error, string> =>
  fromEither(
    pathExistsSync(path) ? right(path) : left(error("path is invalid"))
  );

export const walkSync = (
  path: string
): IOEither<Error, ReadonlyArray<klawSync.Item>> =>
  tryCatch(() => klawSync(path, { nodir: true }));

export const isTargetDifferentFromSourcePath = curry(
  (target: string, source: string) =>
    target !== source
      ? right(target)
      : left(error("target and source paths must be different"))
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
