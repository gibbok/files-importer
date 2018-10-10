import chalk from "chalk";
import { log } from "fp-ts/lib/Console";
import { compose, curry } from "fp-ts/lib/function";

export const withPrefix = curry(
  (x: string, y: string) => `file-importer: ${x}: ${y}`
);

export const withPrefixSuccess = withPrefix("success");

export const withPrefixError = withPrefix("error");

export const logSuccess = compose(
  log,
  chalk.bold.greenBright,
  withPrefixSuccess
);

export const logError = compose(
  log,
  chalk.bold.red,
  withPrefixError
);
