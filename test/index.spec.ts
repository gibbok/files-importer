import * as assert from "assert";
import { statSync } from "fs";
import { outputFileSync, removeSync } from "fs-extra";
import { tmpdir } from "os";
import * as pathN from "path";
import { checkArgs, checkPaths, pathExist, walkSync } from "../src";

const TEST_DIR = pathN.join(tmpdir(), "files-importer");
const BAD_PATH = "./invalid-path";

const createFile = (path: string) => outputFileSync(path, "hello!");
const removeFile = (path: string) => removeSync(path);

describe("checkArgs", () => {
  it("should return left when not all arguments are passed", () => {
    const args: ReadonlyArray<string> = ["npm", "start"];
    const ca = checkArgs(args);
    assert.strictEqual(ca.isLeft(), true);
    assert.strictEqual(ca.isRight(), false);
  });

  it("should return left when more arguments are passed", () => {
    const args: ReadonlyArray<string> = [
      "npm",
      "start",
      "target",
      "source",
      "other"
    ];
    const ca = checkArgs(args);
    assert.strictEqual(ca.isLeft(), true);
    assert.strictEqual(ca.isRight(), false);
  });

  it("should return right with args when target and source are passed", () => {
    const args: ReadonlyArray<string> = ["npm", "start", "target", "source"];
    const ca = checkArgs(args);
    assert.deepStrictEqual(ca.value, args);
    assert.strictEqual(ca.isLeft(), false);
    assert.strictEqual(ca.isRight(), true);
  });
});

describe("checkPaths", () => {
  it("should return left if source and target paths are identical", () => {
    const ts = checkPaths(["npm", "start", TEST_DIR, TEST_DIR]);
    assert.strictEqual(ts.isLeft(), true);
    assert.strictEqual(ts.isRight(), false);
  });

  it("should return right with an array if source and target paths are different", () => {
    const args: ReadonlyArray<string> = ["npm", "start", TEST_DIR, "target"];
    const ts = checkPaths(args);
    assert.deepStrictEqual(ts.value, [TEST_DIR, "target"]);
  });
});

describe("pathExist", () => {
  const goodPath = `${TEST_DIR}/file.txt`;

  beforeAll(() => createFile(goodPath));

  afterAll(() => removeFile(TEST_DIR));

  it("should return left if path is invalid", () => {
    const fe = pathExist(BAD_PATH);
    assert.strictEqual(fe.isLeft(), true);
    assert.strictEqual(fe.isRight(), false);
  });

  it("should return right if path is valid", () => {
    console.log("xxxxxxxx", goodPath);
    const fe = pathExist(goodPath);
    assert.strictEqual(fe.isLeft(), false);
    assert.strictEqual(fe.isRight(), true);
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
});
