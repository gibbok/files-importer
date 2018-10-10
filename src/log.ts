import chalk from "chalk";
import { log } from "fp-ts/lib/Console";
import { compose } from "fp-ts/lib/function";

export const withPrefix = (s: string): string => `\n file-importer: ${s}`;

export const logSuccess = compose(
  log,
  chalk.bold.greenBright,
  withPrefix
);

export const logError = compose(
  log,
  chalk.bold.red,
  withPrefix
);
