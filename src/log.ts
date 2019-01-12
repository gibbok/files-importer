/* tslint:disable:no-expression-statement */
import chalk from "chalk";
import { log } from "fp-ts/lib/Console";
import { compose, curry } from "fp-ts/lib/function";
import { IO } from "fp-ts/lib/IO";
import { PathHashList } from "../src/types";

/**
 * Prefix a string.
 */
export const withPrefix = curry((x: string, y: string) => `file-importer: ${x}: ${y}`);

/**
 * Prefix a string with `success`.
 */
export const withPrefixSuccess = withPrefix("success");

/**
 * Prefix a string with `error`.
 */
export const withPrefixError = withPrefix("error");

/**
 * Prefix a string with `info`.
 */
export const withPrefixInfo = withPrefix("info");

/**
 * Log to console with prefix `success` using a green color.
 */
export const logSuccess = compose(
  log,
  x => chalk.bold.greenBright(x),
  withPrefixSuccess
);

/**
 * Log to console with prefix `error` using a red color.
 */
export const logError = compose(
  log,
  x => chalk.bold.red(x),
  withPrefixError
);

/**
 * Log to console using a blue color.
 */
export const logInfo = compose(
  log,
  x => chalk.bold.grey(x),
  withPrefixInfo
);

/**
 * Log to console a list of messages.
 */
export const logMessages = curry((fn: (a: string) => IO<void>, messages: ReadonlyArray<string>) =>
  messages.forEach(x => fn(x).run())
);

/**
 * Log to console a list of `error` messages.
 */
export const logErrors = logMessages(logError);

/**
 * Log to console a list of `success` messages.
 */
export const logSuccesses = logMessages(logSuccess);

/**
 * Log to console a list of `info` messages.
 */
export const logInfos = logMessages(logInfo);

/**
 * Show how many new files were found between `source` and `target` directories.
 */
export const logReport = (include: PathHashList) => {
  const totFiles = include.length;
  log(
    withPrefixInfo(
      totFiles > 0
        ? `${totFiles} new files found. Do you want to copy them to \`target\`?`
        : "No new files found."
    )
  ).run();
  logInfos(include.map(x => x.path));
};
