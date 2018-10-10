import chalk from "chalk";
import { log } from "fp-ts/lib/Console";
import { compose } from "fp-ts/lib/function";
import { IO } from "fp-ts/lib/IO";

export const logger = (s: string): IO<void> => log(s);

export const withPrefix = (s: string): string => `\n file-importer: ${s}`;

export const logSuccess = compose(
  logger,
  chalk.bold.greenBright,
  withPrefix
);

export const logError = compose(
  logger,
  chalk.bold.red,
  withPrefix
);
