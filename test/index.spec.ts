import * as assert from "assert";
import { statSync } from "fs";
import { outputFileSync, removeSync } from "fs-extra";
import { tmpdir } from "os";
import * as pathN from "path";
import { fileExist, walkSync } from "../src";

const TEST_DIR = pathN.join(tmpdir(), "files-importer");

const createFile = (path: string) => outputFileSync(path, "hello!");
const removeFile = (path: string) => removeSync(path);
const badPath = "./invalid-path";

describe("fileExist", () => {
  const goodPath = `${TEST_DIR}/file.txt`;

  beforeAll(() => createFile(goodPath));

  afterAll(() => removeFile(TEST_DIR));

  it("should be valid for good path", () => {
    const fe = fileExist(goodPath).run();
    expect(fe.value).toEqual(true);
  });

  it("should throw an error for an invalid path", () => {
    const fe = fileExist(badPath).run();
    assert.strictEqual(fe.value instanceof Error, true);
  });
});

describe("walkSynch", () => {
  const fileNames: ReadonlyArray<string> = [
    `${TEST_DIR}/file1.txt`,
    `${TEST_DIR}/file2.txt`,
    `${TEST_DIR}/sub/file3.txt`,
    `${TEST_DIR}/sub/file4.txt`,
    `${TEST_DIR}/sub/sub/file5.txt`,
    `${TEST_DIR}/sub/sub/file6.txt`
  ];

  beforeAll(() => fileNames.map(createFile));

  afterAll(() => removeFile(TEST_DIR));

  it("should create path list", () => {
    const result = fileNames.map((path: string) => ({
      path,
      stats: statSync(path)
    }));
    const ws = walkSync(TEST_DIR).run();
    assert.deepStrictEqual(ws.value, result);
  });

  it("should throw an error if it does not walk", () => {
    const ws = walkSync(badPath).run();
    assert.strictEqual(ws.value instanceof Error, true);
  });
});
