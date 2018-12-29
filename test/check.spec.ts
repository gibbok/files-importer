import * as assert from "assert";
import { checkArgs, checkPath, checkPathsUnequal } from "../src/check";
import { BAD_PATH, createFile, removeFile, TEST_DIR } from "../src/test-common";

describe("checkArgs", () => {
  it("should return left with list of error messages when not all arguments are passed", () => {
    const args: ReadonlyArray<string> = ["npm", "start"];
    const ca = checkArgs(args);
    assert.strictEqual(ca.isLeft(), true);
    assert.strictEqual(ca.isRight(), false);
    assert.strictEqual(ca.isLeft() && ca.value[0].includes("only"), true);
  });

  it("should return left with list of error messages when more arguments than necessary are passed", () => {
    const args: ReadonlyArray<string> = ["npm", "start", "source", "target", "other"];
    const ca = checkArgs(args);
    assert.strictEqual(ca.isLeft(), true);
    assert.strictEqual(ca.isRight(), false);
    assert.strictEqual(ca.isLeft() && ca.value[0].includes("invalid"), true);
  });

  it("should return right with an array with source and destination as passed via arguments", () => {
    const args: ReadonlyArray<string> = ["npm", "start", "source", "target"];
    const ca = checkArgs(args);
    assert.strictEqual(ca.isLeft(), false);
    assert.strictEqual(ca.isRight(), true);
    assert.strictEqual(ca.isRight() && ca.value.source, args[2]);
    assert.strictEqual(ca.isRight() && ca.value.target, args[3]);
  });
});

describe("checkPathsUnequal", () => {
  const source = TEST_DIR;
  const target = "target";
  it("should return left with a list of error messages if source and target paths are identical", () => {
    const ts = checkPathsUnequal({ source, target: source });
    assert.strictEqual(ts.isLeft(), true);
    assert.strictEqual(ts.isRight(), false);
    assert.strictEqual(ts.isLeft() && ts.value[0].includes("invalid"), true);
  });

  it("should return right with an array if source and target paths are different", () => {
    const ts = checkPathsUnequal({ source, target });
    assert.strictEqual(ts.isLeft(), false);
    assert.strictEqual(ts.isRight(), true);
    assert.deepStrictEqual(ts.value, { source, target });
  });
});

describe("checkPathCurry", () => {
  const goodPath = `${TEST_DIR}/file.txt`;

  beforeAll(() => createFile(goodPath));

  afterAll(() => removeFile(TEST_DIR));

  it("should return left with an error message for `source` if path is invalid", () => {
    const fe = checkPath("source")(BAD_PATH);
    assert.strictEqual(fe.isLeft(), true);
    assert.strictEqual(fe.isRight(), false);
    assert.strictEqual(fe.value[0].includes("source path is invalid"), true);
  });

  it("should return left with an error message for `target` if path is invalid", () => {
    const fe = checkPath("target")(BAD_PATH);
    assert.strictEqual(fe.isLeft(), true);
    assert.strictEqual(fe.isRight(), false);
    assert.strictEqual(fe.value[0].includes("target path is invalid"), true);
  });

  it("should return right with a string as path if `source` path is valid and exists", () => {
    const fe = checkPath("source")(goodPath);
    assert.strictEqual(fe.isLeft(), false);
    assert.strictEqual(fe.isRight(), true);
    assert.strictEqual(fe.value, goodPath);
  });

  it("should return right with a string as path if `target` path is valid and exists", () => {
    const fe = checkPath("target")(goodPath);
    assert.strictEqual(fe.isLeft(), false);
    assert.strictEqual(fe.isRight(), true);
    assert.strictEqual(fe.value, goodPath);
  });
});
