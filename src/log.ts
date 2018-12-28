import chalk from "chalk";
import { log } from "fp-ts/lib/Console";
import { compose, curry } from "fp-ts/lib/function";

export const withPrefix = curry((x: string, y: string) => `file-importer: ${x}: ${y}`);

export const withPrefixSuccess = withPrefix("success");

export const withPrefixError = withPrefix("error");

export const logSuccess = compose(
  log,
  x => chalk.bold.greenBright(x),
  withPrefixSuccess
);

export const logError = compose(
  log,
  x => chalk.bold.red(x),
  withPrefixError
);
