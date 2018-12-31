/* tslint:disable:no-expression-statement */
import * as assert from "assert";
import { mkdirSync, pathExistsSync, readdirSync } from "fs-extra";
import { main } from "../src";
import { createFile, removeFile, TEST_DIR } from "../src/test-common";

afterEach(() => removeFile(TEST_DIR));

describe("program", () => {
  const fileNames: ReadonlyArray<string> = [
    `${TEST_DIR}/source/file1.txt`,
    `${TEST_DIR}/source/sub/file2.txt`,
    `${TEST_DIR}/source/file3.txt`,
    `${TEST_DIR}/target/file1.txt`,
    `${TEST_DIR}/target/file3.txt`
  ];

  beforeAll(() => fileNames.map(createFile));

  it("should run the program performing a files comparison between two folders `source` and `target`, if `source` has one more file than `target` add one file to `target`", () => {
    main(["npm", "start", `${TEST_DIR}/source`, `${TEST_DIR}/target`]);
    assert.deepEqual(pathExistsSync(`${TEST_DIR}/target/source/sub/file2.txt`), true);
  });
});

describe("program", () => {
  const fileNames: ReadonlyArray<string> = [
    `${TEST_DIR}/source/file1.txt`,
    `${TEST_DIR}/source/sub/file2.txt`,
    `${TEST_DIR}/target/file1.txt`,
    `${TEST_DIR}/target/sub/file2.txt`
  ];

  beforeAll(() => fileNames.map(createFile));

  it("should run the program performing a files comparison between two folders `source` and `target`, if `source` and `target` have same files, no files should be added to `target` ", () => {
    main(["npm", "start", `${TEST_DIR}/source`, `${TEST_DIR}/target`]);
    assert.deepEqual(readdirSync(`${TEST_DIR}/target`), ["file1.txt", "sub"]);
    assert.deepEqual(readdirSync(`${TEST_DIR}/target/sub`), ["file2.txt"]);
  });
});

describe("program", () => {
  const fileNames: ReadonlyArray<string> = [
    `${TEST_DIR}/source/file1.txt`,
    `${TEST_DIR}/source/sub/file2.txt`,
    `${TEST_DIR}/source/sub/sub/file3.txt`
  ];

  beforeAll(() => {
    fileNames.map(createFile);
    mkdirSync(`${TEST_DIR}/target`);
  });

  it("should run the program performing a files comparison between two folders `source` and `target`, if `source` has tree new files and `target` has none, tree files should be added to `target`", () => {
    main(["npm", "start", `${TEST_DIR}/source`, `${TEST_DIR}/target`]);
    assert.deepEqual(readdirSync(`${TEST_DIR}/target/source`), ["file1.txt", "sub"]);
    assert.deepEqual(readdirSync(`${TEST_DIR}/target/source/sub`), ["file2.txt", "sub"]);
    assert.deepEqual(readdirSync(`${TEST_DIR}/target/source/sub/sub`), ["file3.txt"]);
  });
});
