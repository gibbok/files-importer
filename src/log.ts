import chalk from "chalk";
import { log } from "fp-ts/lib/Console";
import { compose, curry } from "fp-ts/lib/function";
import { IO } from "fp-ts/lib/IO";

export const withPrefix = curry((x: string, y: string) => `file-importer: ${x}: ${y}`);

export const withPrefixSuccess = withPrefix("success");

export const withPrefixError = withPrefix("error");

export const withPrefixInfo = withPrefix("info");

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

export const logInfo = compose(
  log,
  x => chalk.bold.blue(x),
  withPrefixInfo
);

export const logMessages = curry((fn: (a: string) => IO<void>, messages: ReadonlyArray<string>) =>
  messages.forEach(x => fn(x).run())
);

export const logErrors = logMessages(logError);

export const logSuccesses = logMessages(logSuccess);

export const logInfos = logMessages(logInfo);
