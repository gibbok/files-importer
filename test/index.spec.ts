/* tslint:disable:no-expression-statement */
import * as assert from "assert";
import { mkdirSync, pathExistsSync, readdirSync } from "fs-extra";
import { getUserInput, main } from "../src";
import { createFile, removeFile, TEST_DIR } from "../src/test-common";
jest.mock("readline");

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
    main(["npm", "start", `${TEST_DIR}/source`, `${TEST_DIR}/target`], "test");
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
  beforeEach(() => fileNames.map(createFile));
  afterEach(() => removeFile(TEST_DIR));

  it("should perform files comparison between `source` and `target` folders, if `source` and `target` have the same files, no files should be added to `target`", () => {
    main(["npm", "start", `${TEST_DIR}/source`, `${TEST_DIR}/target`], "test");
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
  beforeEach(() => {
    fileNames.map(createFile);
    mkdirSync(`${TEST_DIR}/target`);
  });
  afterEach(() => removeFile(TEST_DIR));

  it("should perform files comparison between `source` and `target` folders, if `source` has tree new files and `target` has none, the tree files should be added to `target`", () => {
    main(["npm", "start", `${TEST_DIR}/source`, `${TEST_DIR}/target`], "test");
    assert.deepEqual(readdirSync(`${TEST_DIR}/target/source`), ["file1.txt", "sub"]);
    assert.deepEqual(readdirSync(`${TEST_DIR}/target/source/sub`), ["file2.txt", "sub"]);
    assert.deepEqual(readdirSync(`${TEST_DIR}/target/source/sub/sub`), ["file3.txt"]);
  });
});

// describe("program", () => {
//   const fileNames: ReadonlyArray<string> = [`${TEST_DIR}/source/file1.txt`];
//   beforeEach(() => {
//     fileNames.map(createFile);
//     mkdirSync(`${TEST_DIR}/target`);
//   });
//   afterEach(() => removeFile(TEST_DIR));
//   afterAll(() => process.exit);

//   it("should not copy files to `target` if user has not confirmed operation in cli prompt", () => {
//     main(["npm", "start", `${TEST_DIR}/source`, `${TEST_DIR}/target`]);
//     assert.deepEqual(existsSync(`${TEST_DIR}/target/source`), false);
//   });
// });

describe.only("program", () => {
  it("should wait user prompt in cli", () => {
    const mock = jest.fn();
    getUserInput(mock);
    expect(mock).not.toHaveBeenCalled();
  });

  it.only("should execute a cb when user prompt in cli y", () => {
    const mock = jest.fn();
    getUserInput(mock);
    expect(mock).toHaveBeenCalled();
  });
});
