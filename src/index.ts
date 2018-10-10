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
      y => y.run(),
      x =>
        x.map((j: any) =>
          logSuccess(`${JSON.stringify(j, undefined, 4)} \n >>>>>>>> ok`).run()
        )
    );

// tslint:disable-next-line:no-expression-statement
program(process.argv);
