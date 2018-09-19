import chalk from "chalk";
import { log } from "fp-ts/lib/Console";
import { fromIO, TaskEither } from "fp-ts/lib/TaskEither";

export const logger = (x: string): TaskEither<Error, void> => fromIO(log(x));

export const withPrefix = (x: string): string => `\n ${x}`;
