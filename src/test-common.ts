import { outputFileSync, removeSync } from "fs-extra";
import { tmpdir } from "os";
import * as pathN from "path";

export const TEST_DIR = pathN.join(tmpdir(), "files-importer");
export const BAD_PATH = "./invalid-path";

export const createFile = (path: string) => outputFileSync(path, "hello!");
export const removeFile = (path: string) => removeSync(path);
