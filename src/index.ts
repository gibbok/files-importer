import { checkArgs, checkPathsUnequal } from "./check";
import { logSuccess } from "./log";

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
