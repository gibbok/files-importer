/* tslint:disable:no-expression-statement */
import * as assert from "assert";
import { pathExistsSync, readdirSync } from "fs-extra";
import { main } from "../src";
import { createFile, removeFile, TEST_DIR } from "../src/test-common";

describe("program", () => {
  const fileNames: ReadonlyArray<string> = [
    `${TEST_DIR}/source/file1.txt`,
    `${TEST_DIR}/source/sub/file2.txt`,
    `${TEST_DIR}/source/file3.txt`,
    `${TEST_DIR}/target/file1.txt`,
    `${TEST_DIR}/target/file3.txt`
  ];
  beforeAll(() => fileNames.map(createFile));

  afterAll(() => removeFile(TEST_DIR));

  it("should run the program adding file into the os, source has one more file than target", () => {
    main(["npm", "start", `${TEST_DIR}/source`, `${TEST_DIR}/target`]);
    assert.deepEqual(pathExistsSync(`${TEST_DIR}/target/source/sub/file2.txt`), true);
  });
});

describe("program", () => {
  const fileNames2: ReadonlyArray<string> = [
    `${TEST_DIR}/source/file1.txt`,
    `${TEST_DIR}/source/sub/file2.txt`,
    `${TEST_DIR}/target/file1.txt`,
    `${TEST_DIR}/target/sub/file2.txt`
  ];
  beforeAll(() => fileNames2.map(createFile));

  afterAll(() => removeFile(TEST_DIR));

  it("should run the program without adding any files into the os, source and target have the same files", () => {
    main(["npm", "start", `${TEST_DIR}/source`, `${TEST_DIR}/target`]);
    assert.deepEqual(readdirSync(`${TEST_DIR}/target`), ["file1.txt", "sub"]);
    assert.deepEqual(readdirSync(`${TEST_DIR}/target/sub`), ["file2.txt"]);
  });
});
