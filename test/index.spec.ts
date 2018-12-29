/* tslint:disable:no-expression-statement */
import * as assert from "assert";
import { pathExistsSync } from "fs-extra";
import { main } from "../src";
import { createFile, removeFile, TEST_DIR } from "../src/test-common";

const fileNames: ReadonlyArray<string> = [
  `${TEST_DIR}/source/file1.txt`,
  `${TEST_DIR}/source/sub/file2.txt`,
  `${TEST_DIR}/source/file3.txt`,
  `${TEST_DIR}/target/file1.txt`,
  `${TEST_DIR}/target/file3.txt`
];

describe.only("program", () => {
  beforeAll(() => fileNames.map(createFile));

  afterAll(() => removeFile(TEST_DIR));

  it("should run the program adding file into the os", () => {
    main(["npm", "start", `${TEST_DIR}/source`, `${TEST_DIR}/target`]);
    assert.strictEqual(pathExistsSync(`${TEST_DIR}/target/source/sub/file2.txt`), true);
  });
});
