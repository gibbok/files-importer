import { IOEither, tryCatch } from "fp-ts/lib/IOEither";
import klawSync from "klaw-sync";
import { checkArgs, checkPathsUnequal } from "./check";
import { logSuccess } from "./log";

export const walkSync = (
  path: string
): IOEither<Error, ReadonlyArray<klawSync.Item>> =>
  tryCatch(() => klawSync(path, { nodir: true }));

const program = (args: ReadonlyArray<string>) =>
  checkArgs(args)
    .chain(checkPathsUnequal)
    .fold(
      y => y.run(), // run console.log
      x =>
        x.map((j: any) =>
          logSuccess(`${JSON.stringify(j, undefined, 4)} \n >>>>>>>> ok`).run()
        )
    );

// tslint:disable-next-line:no-expression-statement
program(process.argv);
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
