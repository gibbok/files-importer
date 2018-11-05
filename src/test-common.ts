import { outputFileSync, removeSync } from "fs-extra";
import { tmpdir } from "os";
import * as path from "path";

export const TEST_DIR = path.join(tmpdir(), "files-importer");
export const BAD_PATH = "./invalid-path";

export const createFile = (p: string) => outputFileSync(p, "hello!");

export const removeFile = (p: string) => removeSync(p);
