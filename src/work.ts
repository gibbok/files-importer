/* tslint:disable:no-let no-expression-statement no-if-statement */
import { createHash } from "crypto";
import { lefts, zipWith } from "fp-ts/lib/Array";
import { Either, left, right, tryCatch2v } from "fp-ts/lib/Either";
import { curry, identity } from "fp-ts/lib/function";
import { fromNullable } from "fp-ts/lib/Option";
import { closeSync, copySync, openSync, readSync } from "fs-extra";
import klawSync from "klaw-sync";
import * as nodePath from "path";
import { prompt, PromptObject } from "prompts";
import { logErrors, logInfos, logReport, logSuccesses } from "./log";
import { Errors, ErrorWithMessage, PathHash, PathHashList } from "./types";
import { isErrorMessage } from "./utility";

/**
 * Walk the file system starting from one folder.
 */
export const walkSync = (p: string): Either<Errors, ReadonlyArray<string>> =>
  tryCatch2v(
    () => klawSync(p, { nodir: true }).map(({ path }) => path),
    (e: unknown | ErrorWithMessage): ReadonlyArray<string> => [
      `cannot walk the file system${isErrorMessage(e) ? ` ${e.message}` : ""}`
    ]
  );

/**
 * Create a list of file paths and md5 hashes pair.
 */
export const mkPathHashList = (
  walkedPaths: ReadonlyArray<string>
): Either<Errors, PathHashList> => {
  const paths = walkedPaths.map(identity);
  const hashes = paths.map(md5);
  const hasError = hashes.some(x => x.isLeft());
  return hasError
    ? left(lefts(hashes))
    : right(
        zipWith(paths, hashes, (path: string, hash: Either<string, string>) => ({
          path,
          hash: hash.fold(identity, identity)
        }))
      );
};

/**
 * Create an md5 hash for a file path.
 */
export const md5 = (path: string): Either<Error["message"], string> => {
  const BUFFER_SIZE = 8192;
  let fileDescriptor: number | undefined;
  try {
    fileDescriptor = openSync(path, "r");
    const hash = createHash("md5");
    const buffer = Buffer.alloc(BUFFER_SIZE);
    let bytesRead;
    do {
      bytesRead = readSync(fileDescriptor, buffer, 0, BUFFER_SIZE, null);
      hash.update(buffer.slice(0, bytesRead));
    } while (bytesRead === BUFFER_SIZE);
    return right(hash.digest("hex"));
  } catch (error) {
    return left(error.message);
  } finally {
    fromNullable(fileDescriptor).mapNullable(closeSync);
  }
};

/**
 * Compare two lists of file paths and md5 hashes pair.
 */
export const comparePathHashLists = (
  pathHashListSource: PathHashList,
  pathHashListTarget: PathHashList
) => {
  const matchHash = curry((list: PathHashList, x: PathHash) => list.find(y => y.hash === x.hash));
  const matchHashTarget = matchHash(pathHashListTarget);
  return {
    include: pathHashListSource.filter(x => !matchHashTarget(x)),
    exclude: pathHashListSource.filter(matchHashTarget)
  };
};

/**
 * Copy files to a `target` directory.
 */
export const copyFiles = (
  include: PathHashList,
  target: string
): Either<Errors, ReadonlyArray<string>> => {
  const targetResolved = nodePath.resolve(target);
  const processed = include.map(({ path }) => {
    let destination = "";
    for (let i = 0; i < path.length; i++) {
      if (path[i] !== targetResolved[i]) {
        destination = path.substring(i);
        break;
      }
    }
    const outputPath = nodePath.join(targetResolved, destination);
    try {
      copySync(path, outputPath);
      return {
        path: outputPath,
        error: false,
        errorMessage: ""
      };
    } catch (error) {
      return {
        path: outputPath,
        error: true,
        errorMessage: error.message
      };
    }
  });
  const errors = processed.filter(x => x.error).map(y => y.errorMessage);
  const successes = processed.filter(x => !x.error).map(y => y.path);
  return errors.length >= 1 ? left(errors.concat(successes)) : right(successes);
};

/**
 * Report files asking a confirmation, if positive copy new files to `target`.
 */
export const promptConfirmationCopy = async (
  sourcePathHashList: PathHashList,
  targetPathHashList: PathHashList,
  targetResolved: string,
  promptConfig: PromptObject,
  env?: string
) => {
  const { include, exclude } = comparePathHashLists(sourcePathHashList, targetPathHashList);
  logReport(include);
  /* istanbul ignore next */
  const response = env === "test" ? { value: true } : await prompt(promptConfig);
  /* istanbul ignore next */
  if (response.value) {
    copyFiles(include, targetResolved).fold(logErrors, logSuccesses);
    logInfos(exclude.map(({ path }) => path));
  }
};
