import * as assert from "assert";
import {
  checkArgs,
  checkPath,
  checkPathsInequality,
  checkPathSource,
  checkPathTarget
} from "../src/check";
import { BAD_PATH, createFile, removeFile, TEST_DIR } from "../src/test-common";

describe("checkArgs", () => {
  it("should check the arguments passed and return left with a list of error messages when not all arguments are provided", () => {
    const args: ReadonlyArray<string> = ["npm", "start"];
    const ca = checkArgs(args);
    assert.strictEqual(ca.isLeft() && ca.value[0].includes("only"), true);
    assert.strictEqual(ca.isRight(), false);
  });

  it("should check the arguments passed and return left with a list of error messages when more arguments than necessary are provided", () => {
    const args: ReadonlyArray<string> = ["npm", "start", "source", "target", "other"];
    const ca = checkArgs(args);
    assert.strictEqual(ca.isLeft() && ca.value[0].includes("invalid"), true);
    assert.strictEqual(ca.isRight(), false);
  });

  it("should check the arguments passed and return right with an object with resolved paths for `source` and `target`", () => {
    const args: ReadonlyArray<string> = ["npm", "start", "source", "target"];
    const ca = checkArgs(args);
    assert.strictEqual(ca.isLeft(), false);
    assert.strictEqual(ca.isRight() && ca.value.source, args[2]);
    assert.strictEqual(ca.isRight() && ca.value.target, args[3]);
  });
});

describe("checkPathsInequality", () => {
  const source = TEST_DIR;
  const target = "target";
  it("should check inputted `source` and `target` for inequality and return left with a list of error messages if `source` and `target` paths are identical", () => {
    const ts = checkPathsInequality({ source, target: source });
    assert.strictEqual(ts.isLeft() && ts.value[0].includes("invalid"), true);
    assert.strictEqual(ts.isRight(), false);
  });

  it("should check inputted `source` and `target` for inequality and return right with an object with `source` and `target` as passed via arguments if both paths are different", () => {
    const ts = checkPathsInequality({ source, target });
    assert.strictEqual(ts.isLeft(), false);
    assert.deepStrictEqual(ts.isRight() && ts.value, { source, target });
  });
});

describe("checkPath", () => {
  const goodPath = `${TEST_DIR}/file.txt`;
  beforeAll(() => createFile(goodPath));

  afterAll(() => removeFile(TEST_DIR));

  it("should check the provided path for validity and return left with an error message for `source` if path is invalid", () => {
    const fe = checkPath("source")(BAD_PATH);
    assert.strictEqual(fe.isLeft() && fe.value[0].includes("source path is invalid"), true);
    assert.strictEqual(fe.isRight(), false);
  });

  it("should check the provided path for validity and return right with a string for `source` if path is valid and exists", () => {
    const fe = checkPath("source")(goodPath);
    assert.strictEqual(fe.isLeft(), false);
    assert.strictEqual(fe.isRight() && fe.value, goodPath);
  });
});

describe("checkPathSource", () => {
  const goodPath = `${TEST_DIR}/file.txt`;

  beforeAll(() => createFile(goodPath));

  afterAll(() => removeFile(TEST_DIR));

  it("should check the provided path for validity and return left with an error message for `source` if path is invalid", () => {
    const fe = checkPathSource(BAD_PATH);
    assert.strictEqual(fe.isLeft() && fe.value[0].includes("source path is invalid"), true);
    assert.strictEqual(fe.isRight(), false);
  });

  it("should check the provided path for validity and return right with a string for `source` if path is valid and exists", () => {
    const fe = checkPathSource(goodPath);
    assert.strictEqual(fe.isLeft(), false);
    assert.strictEqual(fe.isRight() && fe.value, goodPath);
  });
});

describe("checkPathTarget", () => {
  const goodPath = `${TEST_DIR}/file.txt`;

  beforeAll(() => createFile(goodPath));

  afterAll(() => removeFile(TEST_DIR));

  it("should check the provided path for validity and return left with an error message for `target` if path is invalid", () => {
    const fe = checkPathTarget(BAD_PATH);
    assert.strictEqual(fe.isLeft() && fe.value[0].includes("target path is invalid"), true);
    assert.strictEqual(fe.isRight(), false);
  });

  it("should check the provided path for validity and return right with a string for `target` if path is valid and exists", () => {
    const fe = checkPathTarget(goodPath);
    assert.strictEqual(fe.isLeft(), false);
    assert.strictEqual(fe.isRight() && fe.value, goodPath);
  });
});
