import { outputFileSync, removeSync } from "fs-extra";
import { tmpdir } from "os";
import * as nodePath from "path";
import { ErrorWithMessage } from "./types";

/**
 * Create a temporary directory where tests will be executed.
 */
export const TEST_DIR = nodePath.join(tmpdir(), "files-importer");

/**
 * Create an invalid path.
 */
export const BAD_PATH = "./invalid-path";

/**
 * Create a file which has content its file name for testing purposes.
 */
export const createFile = (p: string) => outputFileSync(p, nodePath.basename(p));

/**
 * Remove a file.
 */
export const removeFile = (p: string) => removeSync(p);

/**
 * Check if an error has a message.
 */
export const isErrorMessage = (error: ErrorWithMessage | unknown): error is ErrorWithMessage =>
  // tslint:disable-next-line: strict-type-predicates
  (error as ErrorWithMessage).message !== undefined;
