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
  it("should check arguments and return left with an error message when not all arguments are provided", () => {
    const args: ReadonlyArray<string> = ["npm", "start"];
    const ca = checkArgs(args);
    assert.strictEqual(ca.isLeft() && ca.value[0].includes("only"), true);
    assert.strictEqual(ca.isRight(), false);
  });

  it("should check arguments and return left with an error message when more arguments than required are provided", () => {
    const args: ReadonlyArray<string> = ["npm", "start", "source", "target", "other"];
    const ca = checkArgs(args);
    assert.strictEqual(ca.isLeft() && ca.value[0].includes("invalid"), true);
    assert.strictEqual(ca.isRight(), false);
  });

  it("should check arguments and return right with an object with properties `source` and `target` as passed", () => {
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
  it("should compare `source` and `target` for inequality and return left with an error messages if their are identical", () => {
    const ts = checkPathsInequality({ source, target: source });
    assert.strictEqual(ts.isLeft() && ts.value[0].includes("invalid"), true);
    assert.strictEqual(ts.isRight(), false);
  });

  it("should compare `source` and `target` for inequality and return right with the passed object if they are not identical", () => {
    const ts = checkPathsInequality({ source, target });
    assert.strictEqual(ts.isLeft(), false);
    assert.deepStrictEqual(ts.isRight() && ts.value, { source, target });
  });
});

describe("checkPath", () => {
  const goodPath = `${TEST_DIR}/file.txt`;
  beforeAll(() => createFile(goodPath));

  afterAll(() => removeFile(TEST_DIR));

  it("should check path and return left with an error message for `source` if path is invalid", () => {
    const fe = checkPath("source")(BAD_PATH);
    assert.strictEqual(fe.isLeft() && fe.value[0].includes("source path is invalid"), true);
    assert.strictEqual(fe.isRight(), false);
  });

  it("should check path and return right with the path passed if it is valid", () => {
    const fe = checkPath("source")(goodPath);
    assert.strictEqual(fe.isLeft(), false);
    assert.strictEqual(fe.isRight() && fe.value, goodPath);
  });
});

describe("checkPathSource", () => {
  const goodPath = `${TEST_DIR}/file.txt`;

  beforeAll(() => createFile(goodPath));

  afterAll(() => removeFile(TEST_DIR));

  it("should check path `source` and return left with an error message if path is invalid", () => {
    const fe = checkPathSource(BAD_PATH);
    assert.strictEqual(fe.isLeft() && fe.value[0].includes("source path is invalid"), true);
    assert.strictEqual(fe.isRight(), false);
  });

  it("should check path `source` and return right with the path if it is valid", () => {
    const fe = checkPathSource(goodPath);
    assert.strictEqual(fe.isLeft(), false);
    assert.strictEqual(fe.isRight() && fe.value, goodPath);
  });
});

describe("checkPathTarget", () => {
  const goodPath = `${TEST_DIR}/file.txt`;

  beforeAll(() => createFile(goodPath));

  afterAll(() => removeFile(TEST_DIR));

  it("should check path `target` and return left with an error message if path is invalid", () => {
    const fe = checkPathTarget(BAD_PATH);
    assert.strictEqual(fe.isLeft() && fe.value[0].includes("target path is invalid"), true);
    assert.strictEqual(fe.isRight(), false);
  });

  it("should check path `target` and return right with the path if it is valid", () => {
    const fe = checkPathTarget(goodPath);
    assert.strictEqual(fe.isLeft(), false);
    assert.strictEqual(fe.isRight() && fe.value, goodPath);
  });
});
