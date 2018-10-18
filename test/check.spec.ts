import * as assert from "assert";
import { checkArgs, checkPath, checkPathsUnequal } from "../src/check";
import { BAD_PATH, createFile, removeFile, TEST_DIR } from "../src/testCommon";

describe("checkArgs", () => {
  it("should return left when not all arguments are passed", () => {
    const args: ReadonlyArray<string> = ["npm", "start"];
    const ca = checkArgs(args);
    assert.strictEqual(ca.isLeft(), true);
    assert.strictEqual(ca.isRight(), false);
    assert.deepStrictEqual(typeof ca.value, "string");
  });

  it("should return left when more arguments than necessary are passed", () => {
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

  it("should return array with source and destination when are passed as arguments", () => {
    const args: ReadonlyArray<string> = ["npm", "start", "target", "source"];
    const ca = checkArgs(args);
    assert.strictEqual(ca.isLeft(), false);
    assert.strictEqual(ca.isRight(), true);
    assert.deepStrictEqual(ca.value, args);
  });
});

describe("checkPathsUnequal", () => {
  it("should return left if source and target paths are identical", () => {
    const ts = checkPathsUnequal(["npm", "start", TEST_DIR, TEST_DIR]);
    assert.strictEqual(ts.isLeft(), true);
    assert.strictEqual(ts.isRight(), false);
  });

  it("should return right with an array if source and target paths are different", () => {
    const args: ReadonlyArray<string> = ["npm", "start", TEST_DIR, "target"];
    const ts = checkPathsUnequal(args);
    assert.strictEqual(ts.isLeft(), false);
    assert.strictEqual(ts.isRight(), true);
    assert.deepStrictEqual(ts.value, [TEST_DIR, "target"]);
  });
});

describe("checkPath", () => {
  const goodPath = `${TEST_DIR}/file.txt`;

  beforeAll(() => createFile(goodPath));

  afterAll(() => removeFile(TEST_DIR));

  it("should return left if path is invalid", () => {
    const fe = checkPath(BAD_PATH);
    assert.strictEqual(fe.isLeft(), true);
    assert.strictEqual(fe.isRight(), false);
  });

  it("should return right if path is valid", () => {
    const fe = checkPath(goodPath);
    assert.strictEqual(fe.isLeft(), false);
    assert.strictEqual(fe.isRight(), true);
    assert.strictEqual(fe.value, goodPath);
  });
});
