import { log } from "fp-ts/lib/Console";
import { Either, left, right } from "fp-ts/lib/Either";
import { not } from "fp-ts/lib/function";
import { IO } from "fp-ts/lib/IO";
import { IOEither, tryCatch } from "fp-ts/lib/IOEither";
import { pathExistsSync } from "fs-extra";
import klawSync from "klaw-sync";

export const checkArgs = (
  args: ReadonlyArray<string>
): Either<IO<void>, ReadonlyArray<string>> => {
  return args.length < 4
    ? left(log("source and target must be specified"))
    : args.length > 4
      ? left(log("other arguments are not supported"))
      : right(args);
};

export const checkPaths = (
  args: ReadonlyArray<string>
): Either<IO<void>, ReadonlyArray<string>> => {
  const [, , source, target] = args;
  return source === target
    ? left(log("source and target paths must be different"))
    : right([source, target]);
};

export const pathExist = (path: string): Either<IO<void>, string> => {
  return not(pathExistsSync)(path) ? left(log("path is invalid")) : right(path);
};
export const walkSync = (
  path: string
): IOEither<Error, ReadonlyArray<klawSync.Item>> =>
  tryCatch(() => klawSync(path, { nodir: true }));

const program = (args: ReadonlyArray<string>) =>
  checkArgs(args)
    .chain(checkPaths)
    .fold(
      y => y.run(), // run console.log
      x =>
        x.map((j: any) =>
          log(`${JSON.stringify(j, undefined, 4)} \n >>>>>>>> ok`).run()
        )
    );

// tslint:disable-next-line:no-expression-statement
program(process.argv);
console.log(process.argv);
/*
  - pass args to checkArgs
  - if right passes check if destination is different from source
  - if right passes check each single arg to pathExist
  - if right walkSynch
  - if right checkSum

  `npm start a a` => left
  `npm start a b` => right
  */

// export const comparePaths = curry((targetPath: string, sourcePath: string) => {
//   const result = isTargetDifferentFromSourcePath(targetPath)(sourcePath)
//     .chain(() => pathExist(targetPath))
//     .chain(() => pathExist(sourcePath));
//   return result;
// });
