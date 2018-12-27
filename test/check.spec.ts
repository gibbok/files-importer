import * as assert from "assert";
import { checkArgs, checkPath, checkPathsUnequal } from "../src/check";
import { BAD_PATH, createFile, removeFile, TEST_DIR } from "../src/test-common";

describe("checkArgs", () => {
  it("should return left with list of error messages when not all arguments are passed", () => {
    const args: ReadonlyArray<string> = ["npm", "start"];
    const ca = checkArgs(args);
    assert.strictEqual(ca.isLeft(), true);
    assert.strictEqual(ca.isRight(), false);
    assert.equal(ca.value[0].includes("only"), true);
  });

  it("should return left with list of error messages when more arguments than necessary are passed", () => {
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
    assert.equal(ca.value[0].includes("invalid"), true);
  });

  it("should return right with an array with source and destination as passed via arguments", () => {
    const args: ReadonlyArray<string> = ["npm", "start", "target", "source"];
    const ca = checkArgs(args);
    assert.strictEqual(ca.isLeft(), false);
    assert.strictEqual(ca.isRight(), true);
    assert.strictEqual(ca.value, args);
  });
});

describe("checkPathsUnequal", () => {
  it("should return left with a list of error messages if source and target paths are identical", () => {
    const ts = checkPathsUnequal(["npm", "start", TEST_DIR, TEST_DIR]);
    assert.strictEqual(ts.isLeft(), true);
    assert.strictEqual(ts.isRight(), false);
    assert.strictEqual(ts.value[0].includes("invalid"), true);
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

  it("should return left with an error message if path is invalid", () => {
    const fe = checkPath(BAD_PATH);
    assert.strictEqual(fe.isLeft(), true);
    assert.strictEqual(fe.isRight(), false);
    assert.equal(fe.value[0].includes("invalid"), true);
  });

  it("should return right with a string as path if path is valid and exists", () => {
    const fe = checkPath(goodPath);
    assert.strictEqual(fe.isLeft(), false);
    assert.strictEqual(fe.isRight(), true);
    assert.strictEqual(fe.value, goodPath);
  });
});
