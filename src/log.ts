import chalk from "chalk";
import { log } from "fp-ts/lib/Console";
import { compose, curry } from "fp-ts/lib/function";
import { IO } from "fp-ts/lib/IO";

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
 * Log to console with prefix `success` an using a green color.
 */
export const logSuccess = compose(
  log,
  x => chalk.bold.greenBright(x),
  withPrefixSuccess
);

/**
 * Log to console with prefix `error` an using a red color.
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
  x => chalk.bold.blue(x),
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
