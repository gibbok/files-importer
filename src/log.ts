import chalk from "chalk";
import { log } from "fp-ts/lib/Console";
import { compose } from "fp-ts/lib/function";
import { fromIO, TaskEither } from "fp-ts/lib/TaskEither";

export const logger = (x: string): TaskEither<Error, void> => fromIO(log(x));

export const withPrefix = (x: string): string => `\n ${x}`;

export const success = compose<string, string, string>(
  chalk.bold.greenBright,
  withPrefix
);
