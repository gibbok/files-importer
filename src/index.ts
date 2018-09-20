import { log } from "fp-ts/lib/Console";
import { Either, left, right } from "fp-ts/lib/Either";
import { error } from "fp-ts/lib/Exception";
import { curry } from "fp-ts/lib/function";
import { fromEither, IOEither, tryCatch } from "fp-ts/lib/IOEither";
import { pathExistsSync } from "fs-extra";
import klawSync from "klaw-sync";

export const pathExist = (path: string): IOEither<Error, string> =>
  fromEither(
    pathExistsSync(path) ? right(path) : left(error("path is invalid"))
  );

export const checkArgs = (
  args: ReadonlyArray<string>
): Either<Error, ReadonlyArray<string>> =>
  args.length <= 2
    ? left(error("source and destination must be specified"))
    : right(args);

export const isDestinationDifferentFromSourcePath = curry(
  (destination: string, source: string) =>
    destination !== source
      ? right(destination)
      : left(error("destination and source paths must be different"))
);

export const walkSync = (
  path: string
): IOEither<Error, ReadonlyArray<klawSync.Item>> =>
  tryCatch(() => klawSync(path, { nodir: true }));

const program = (args: ReadonlyArray<string>) =>
  checkArgs(args).chain(isDestinationDifferentFromSourcePath(args[3])(args[4]));
// tslint:disable-next-line:no-expression-statement
program(process.argv);
/*
  - pass args to checkArgs
  - if right passes check if destination is different from source
  - if right passes check each single arg to pathExist
  - if right walkSynch
  - if right checkSum
*/

// export const comparePaths = curry((targetPath: string, sourcePath: string) => {
//   const result = isTargetDifferentFromSourcePath(targetPath)(sourcePath)
//     .chain(() => pathExist(targetPath))
//     .chain(() => pathExist(sourcePath));
//   return result;
// });
