import * as assert from "assert";
import { statSync } from "fs-extra";
import { BAD_PATH, createFile, removeFile, TEST_DIR } from "../src/testCommon";
import { walkSync } from "../src/work";

describe("walkSynch", () => {
  const fileNames: ReadonlyArray<string> = [
    `${TEST_DIR}/file1.txt`,
    `${TEST_DIR}/file2.txt`,
    `${TEST_DIR}/sub/file3.txt`,
    `${TEST_DIR}/sub/file4.txt`,
    `${TEST_DIR}/sub/sub/file5.txt`,
    `${TEST_DIR}/sub/sub/file6.txt`
  ];

  beforeAll(() => fileNames.map(createFile));

  afterAll(() => removeFile(TEST_DIR));

  it("should return left and throw an error if it does not walk", () => {
    const ws = walkSync(BAD_PATH).run();
    assert.strictEqual(ws.isLeft(), true);
    assert.strictEqual(ws.isRight(), false);
    assert.strictEqual(ws.value instanceof Error, true);
  });

  it("should return right creating a path list", () => {
    const result = fileNames.map((path: string) => ({
      path,
      stats: statSync(path)
    }));
    const ws = walkSync(TEST_DIR).run();
    assert.strictEqual(ws.isLeft(), false);
    assert.strictEqual(ws.isRight(), true);
    assert.deepStrictEqual(ws.value, result);
  });
});
