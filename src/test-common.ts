import { outputFileSync, removeSync } from "fs-extra";
import { tmpdir } from "os";
import * as path from "path";

/**
 * Create a temporary directory where tests will be executed.
 */
export const TEST_DIR = path.join(tmpdir(), "files-importer");

/**
 * Create an invalid path.
 */
export const BAD_PATH = "./invalid-path";

/**
 * Create a file which has content is file name for testing porpoise.
 */
export const createFile = (p: string) => outputFileSync(p, path.basename(p));

/**
 * Remove a test file.
 */
export const removeFile = (p: string) => removeSync(p);
