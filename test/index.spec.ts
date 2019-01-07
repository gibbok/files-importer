/* tslint:disable:no-expression-statement */
import * as assert from "assert";
import { mkdirSync, pathExistsSync, readdirSync } from "fs-extra";
import { main, PROMPT_CONFIG } from "../src";
import { createFile, removeFile, TEST_DIR } from "../src/test-common";
// jest.mock("readline");

describe("program", () => {
  const fileNames: ReadonlyArray<string> = [
    `${TEST_DIR}/source/file1.txt`,
    `${TEST_DIR}/source/sub/file2.txt`,
    `${TEST_DIR}/source/file3.txt`,
    `${TEST_DIR}/target/file1.txt`,
    `${TEST_DIR}/target/file3.txt`
  ];
  beforeEach(() => fileNames.map(createFile));
  afterEach(() => removeFile(TEST_DIR));

  it("should perform files comparison between `source` and `target` folders, if `source` has one more file than `target` add that one file to `target`", () => {
    main(["npm", "start", `${TEST_DIR}/source`, `${TEST_DIR}/target`], PROMPT_CONFIG, "test");
    assert.deepStrictEqual(pathExistsSync(`${TEST_DIR}/target/source/sub/file2.txt`), true);
  });
});

describe("program", () => {
  const fileNames: ReadonlyArray<string> = [
    `${TEST_DIR}/source/file1.txt`,
    `${TEST_DIR}/source/sub/file2.txt`,
    `${TEST_DIR}/target/file1.txt`,
    `${TEST_DIR}/target/sub/file2.txt`
  ];
  beforeEach(() => fileNames.map(createFile));
  afterEach(() => removeFile(TEST_DIR));

  it("should perform files comparison between `source` and `target` folders, if `source` and `target` have the same files, no files should be added to `target`", () => {
    main(["npm", "start", `${TEST_DIR}/source`, `${TEST_DIR}/target`], PROMPT_CONFIG, "test");
    assert.deepStrictEqual(
      JSON.stringify(readdirSync(`${TEST_DIR}/target`)),
      JSON.stringify(["file1.txt", "sub"])
    );
    assert.deepStrictEqual(
      JSON.stringify(readdirSync(`${TEST_DIR}/target/sub`)),
      JSON.stringify(["file2.txt"])
    );
  });
});

describe("program", () => {
  const fileNames: ReadonlyArray<string> = [
    `${TEST_DIR}/source/file1.txt`,
    `${TEST_DIR}/source/sub/file2.txt`,
    `${TEST_DIR}/source/sub/sub/file3.txt`
  ];
  beforeEach(() => {
    fileNames.map(createFile);
    mkdirSync(`${TEST_DIR}/target`);
  });
  afterEach(() => removeFile(TEST_DIR));

  it("should perform files comparison between `source` and `target` folders, if `source` has tree new files and `target` has none, the tree files should be added to `target`", () => {
    main(["npm", "start", `${TEST_DIR}/source`, `${TEST_DIR}/target`], PROMPT_CONFIG, "test");
    assert.deepStrictEqual(
      JSON.stringify(readdirSync(`${TEST_DIR}/target/source`)),
      JSON.stringify(["file1.txt", "sub"])
    );
    assert.deepStrictEqual(
      JSON.stringify(readdirSync(`${TEST_DIR}/target/source/sub`)),
      JSON.stringify(["file2.txt", "sub"])
    );
    assert.deepStrictEqual(
      JSON.stringify(readdirSync(`${TEST_DIR}/target/source/sub/sub`)),
      JSON.stringify(["file3.txt"])
    );
  });
});
