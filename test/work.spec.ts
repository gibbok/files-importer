import * as assert from "assert";
import { BAD_PATH, createFile, removeFile, TEST_DIR } from "../src/test-common";
import { md5, mkPathHashList, walkSync } from "../src/work";

const fileNames: ReadonlyArray<string> = [
  `${TEST_DIR}/file1.txt`,
  `${TEST_DIR}/file2.txt`,
  `${TEST_DIR}/sub/file3.txt`,
  `${TEST_DIR}/sub/file4.txt`,
  `${TEST_DIR}/sub/sub/file5.txt`,
  `${TEST_DIR}/sub/sub/file6.txt`
];

describe("walkSynch", () => {
  beforeAll(() => fileNames.map(createFile));

  afterAll(() => removeFile(TEST_DIR));

  it("should return left and return a message if it does not walk", () => {
    const ws = walkSync(BAD_PATH);
    assert.strictEqual(ws.isLeft(), true);
    assert.strictEqual(ws.isRight(), false);
    assert.deepStrictEqual(typeof ws.value, "string");
  });

  it("should return right creating a path list", () => {
    const ws = walkSync(TEST_DIR);
    assert.strictEqual(ws.isLeft(), false);
    assert.strictEqual(ws.isRight(), true);
    assert.deepStrictEqual(ws.value, fileNames);
  });
});

describe("mkPathHashList", () => {
  beforeAll(() => fileNames.map(createFile));

  afterAll(() => removeFile(TEST_DIR));

  it("should return left", () => {
    const r = mkPathHashList([BAD_PATH]);
    assert.strictEqual(r.isLeft(), true);
    assert.strictEqual(r.isRight(), false);
    assert.strictEqual(r.isLeft() && r.value.includes("ENOENT"), true);
    assert.deepStrictEqual(typeof r.value, "string");
  });

  it("should return right with a list of file paths and their hash values", () => {
    const result = fileNames.map((path: string) => ({
      path,
      hash: md5(path).fold(() => "error", (hash: string) => hash)
    }));
    const ws = walkSync(TEST_DIR);
    const r = ws.chain(mkPathHashList);
    assert.strictEqual(r.isLeft(), false);
    assert.strictEqual(r.isRight(), true);
    assert.deepStrictEqual(r.value, result);
  });
});

describe("md5", () => {
  const fileName = `${TEST_DIR}/file1.txt`;

  beforeAll(() => createFile(fileName));

  afterAll(() => removeFile(TEST_DIR));

  it("should return right and create md5 hash for a file", () => {
    const mk = md5(fileName);
    assert.strictEqual(mk.isLeft(), false);
    assert.strictEqual(mk.isRight(), true);
    assert.strictEqual(mk.value, "5a8dd3ad0756a93ded72b823b19dd877");
  });

  it("should return left return an error message", () => {
    const mk = md5(BAD_PATH);
    assert.strictEqual(mk.isLeft(), true);
    assert.strictEqual(mk.isRight(), false);
    assert.strictEqual(mk.value.includes("ENOENT"), true);
  });
});
