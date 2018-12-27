import { checkArgs, checkPathsUnequal } from "./check";
import { logError, logSuccess } from "./log";
import { Errors } from "./types";

const program = (args: ReadonlyArray<string>) =>
  checkArgs(args)
    .chain(checkPathsUnequal)
    .fold(
      (y: Errors) => y.map(j => logError(j).run()),
      (x: ReadonlyArray<string>) =>
        x.map((j: any) =>
          logSuccess(`${JSON.stringify(j, undefined, 4)} \n >>>>>>>> ok`).run()
        )
    );

// tslint:disable-next-line:no-expression-statement
program(process.argv);
