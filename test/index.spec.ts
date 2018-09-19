import * as assert from "assert";
import { statSync } from "fs";
import { outputFileSync, removeSync } from "fs-extra";
import { tmpdir } from "os";
import * as pathN from "path";
import { isTargetDifferentFromSourcePath, pathExist, walkSync } from "../src";

const TEST_DIR = pathN.join(tmpdir(), "files-importer");
const BAD_PATH = "./invalid-path";

const createFile = (path: string) => outputFileSync(path, "hello!");
const removeFile = (path: string) => removeSync(path);

describe("pathExist", () => {
  const goodPath = `${TEST_DIR}/file.txt`;

  beforeAll(() => createFile(goodPath));

  afterAll(() => removeFile(TEST_DIR));

  it("should throw an error for an invalid path", () => {
    const fe = pathExist(BAD_PATH).run();
    assert.strictEqual(fe.value instanceof Error, true);
  });

  it("should be valid for good path", () => {
    const fe = pathExist(goodPath).run();
    assert.strictEqual(fe.value, goodPath);
  });
});

describe("walkSynch", () => {
  beforeAll(() => fileNames.map(createFile));

  afterAll(() => removeFile(TEST_DIR));

  const fileNames: ReadonlyArray<string> = [
    `${TEST_DIR}/file1.txt`,
    `${TEST_DIR}/file2.txt`,
    `${TEST_DIR}/sub/file3.txt`,
    `${TEST_DIR}/sub/file4.txt`,
    `${TEST_DIR}/sub/sub/file5.txt`,
    `${TEST_DIR}/sub/sub/file6.txt`
  ];

  it("should throw an error if it does not walk", () => {
    const ws = walkSync(BAD_PATH).run();
    assert.strictEqual(ws.value instanceof Error, true);
  });

  it("should create path list", () => {
    const result = fileNames.map((path: string) => ({
      path,
      stats: statSync(path)
    }));
    const ws = walkSync(TEST_DIR).run();
    assert.deepStrictEqual(ws.value, result);
  });

  describe("isTargetDifferentFromSourcePath", () => {
    it("should throw an error if target and source paths are identical", () => {
      const ts = isTargetDifferentFromSourcePath(TEST_DIR)(TEST_DIR);
      assert.strictEqual(ts.value instanceof Error, true);
    });

    it("should return true if target and source paths are different", () => {
      const ts = isTargetDifferentFromSourcePath(TEST_DIR)("valid-path");
      assert.strictEqual(ts.value, true);
    });
  });
});
