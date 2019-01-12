/* tslint:disable:no-expression-statement */
import * as assert from "assert";
import { pathExistsSync } from "fs-extra";
import * as nodePath from "path";
import { BAD_PATH, createFile, removeFile, TEST_DIR } from "../src/test-common";
import { PathHashList } from "../src/types";
import { comparePathHashLists, copyFiles, md5, mkPathHashList, walkSync } from "../src/work";

const fileNames: ReadonlyArray<string> = [
  `${TEST_DIR}/file1.txt`,
  `${TEST_DIR}/file2.txt`,
  `${TEST_DIR}/sub/file3.txt`,
  `${TEST_DIR}/sub/file4.txt`,
  `${TEST_DIR}/sub/sub/file5.txt`,
  `${TEST_DIR}/sub/sub/file6.txt`
];

describe("walkSynch", () => {
  beforeEach(() => fileNames.map(createFile));
  afterEach(() => removeFile(TEST_DIR));

  it("should walk a folder and return left with an error message if it could not walk", () => {
    const ws = walkSync(BAD_PATH);
    assert.strictEqual(ws.isLeft() && ws.value[0].includes("ENOENT"), true);
    assert.strictEqual(ws.isRight(), false);
  });

  it("should walk a folder and return right with list of paths", () => {
    const ws = walkSync(TEST_DIR);
    assert.strictEqual(ws.isLeft(), false);
    assert.deepStrictEqual(ws.isRight() && ws.value, fileNames.map(x => nodePath.resolve(x)));
  });
});

describe("mkPathHashList", () => {
  beforeEach(() => fileNames.map(createFile));
  afterEach(() => removeFile(TEST_DIR));

  it("should create hashes for paths and return left with an error message if an error was incurred", () => {
    const r = mkPathHashList([BAD_PATH]);
    assert.strictEqual(r.isLeft() && r.value[0].includes("ENOENT"), true);
    assert.strictEqual(r.isRight(), false);
  });

  it("should create hashes for paths and return right with a list of paths/hashes", () => {
    const result = fileNames.map((p: string) => {
      const pathResolved = nodePath.resolve(p);
      return {
        path: pathResolved,
        hash: md5(pathResolved).fold(() => "error", (hash: string) => hash)
      };
    });
    const ws = walkSync(TEST_DIR);
    const r = ws.chain(mkPathHashList);
    assert.strictEqual(r.isLeft(), false);
    assert.deepStrictEqual(r.isRight() && r.value, result);
  });
});

describe("md5", () => {
  const fileName = `${TEST_DIR}/file1.txt`;
  beforeEach(() => createFile(fileName));
  afterEach(() => removeFile(TEST_DIR));

  it("should create hash for a valid path and return left with an error message if an error was incurred", () => {
    const mk = md5(BAD_PATH);
    assert.strictEqual(mk.isLeft() && mk.value.includes("ENOENT"), true);
    assert.strictEqual(mk.isRight(), false);
  });

  it("should create hash for a valid path and return right it", () => {
    const mk = md5(fileName);
    assert.strictEqual(mk.isLeft(), false);
    assert.strictEqual(mk.isRight() && mk.value, "bd01856bfd2065d0d1ee20c03bd3a9af");
  });
});

describe("comparePathHashLists", () => {
  const pathHash1 = {
    hash: "c4ca4238a0b923820dcc509a6f75849b",
    path: "./source/file1.txt"
  };
  const pathHash2 = {
    hash: "c81e728d9d4c2f636f067f89cc14862c",
    path: "./source/file2.txt"
  };
  const pathHash3 = {
    hash: "eccbc87e4b5ce2fe28308fd9f2a7baf3",
    path: "./souce/file3.txt"
  };
  const pathHash4 = {
    hash: "eccbc87e4b5ce2fe28308fd9f2a7baf3",
    path: "./target/file3.txt"
  };

  it("should compare a hash, if both are identical exclude them", () => {
    const source: PathHashList = [pathHash1];
    const target: PathHashList = [pathHash1];
    const { include, exclude } = comparePathHashLists(source, target);
    assert.deepStrictEqual(include, []);
    assert.deepStrictEqual(exclude, [pathHash1]);
  });

  it("should compare hashes, if both are identical exclude them", () => {
    const source: PathHashList = [pathHash1, pathHash2];
    const target: PathHashList = [pathHash1, pathHash2];
    const { include, exclude } = comparePathHashLists(source, target);
    assert.deepStrictEqual(include, []);
    assert.deepStrictEqual(exclude, [pathHash1, pathHash2]);
  });

  it("should compare a hash, if hash in `source` is not in `target` include hash", () => {
    const source: PathHashList = [pathHash1];
    const target: PathHashList = [];
    const { include, exclude } = comparePathHashLists(source, target);
    assert.deepStrictEqual(include, [pathHash1]);
    assert.deepStrictEqual(exclude, []);
  });

  it("should compare hashes, if hashes in `source` are not in `target` include hashes", () => {
    const source: PathHashList = [pathHash1, pathHash2];
    const target: PathHashList = [];
    const { include, exclude } = comparePathHashLists(source, target);
    assert.deepStrictEqual(include, [pathHash1, pathHash2]);
    assert.deepStrictEqual(exclude, []);
  });

  it("should compare hashes, if some hashes in `source` are not in `target` include them, otherwise exclude", () => {
    const source: PathHashList = [pathHash1, pathHash2, pathHash3];
    const target: PathHashList = [pathHash4];
    const { exclude, include } = comparePathHashLists(source, target);
    assert.deepStrictEqual(include, [pathHash1, pathHash2]);
    assert.deepStrictEqual(exclude, [pathHash3]);
  });

  it("should compare hashes, if no hash in `source`, do not include or exclude", () => {
    const source: PathHashList = [];
    const target: PathHashList = [pathHash4];
    const { exclude, include } = comparePathHashLists(source, target);
    assert.deepStrictEqual(include, []);
    assert.deepStrictEqual(exclude, []);
  });
});

describe("copyFiles", () => {
  const fileName1 = `${TEST_DIR}/source/sub1/sub2/file1.txt`;
  const fileName2 = `${TEST_DIR}/source/sub1/sub2/file2.txt`;
  const fileName3 = `${TEST_DIR}/source/sub1/sub2/no-existing-file.txt`;
  const pathHash1 = {
    hash: "595f44fec1e92a71d3e9e77456ba80d1",
    path: fileName1
  };
  const pathHash2 = {
    hash: "71f920fa275127a7b60fa4d4d41432a3",
    path: fileName2
  };
  const pathHash3 = {
    hash: "71f920fa275127a7b60fa4d4d41432a3",
    path: fileName3
  };
  const output = `${TEST_DIR}/target`;
  beforeEach(() => [fileName1, fileName2].map(createFile));
  afterEach(() => removeFile(TEST_DIR));

  it("should copy files and return left with error messages where errors occurred", () => {
    const r = copyFiles([pathHash1, pathHash2, pathHash3], output);
    assert.strictEqual(pathExistsSync(output), true);
    assert.strictEqual(r.isLeft() && r.value[0].includes("ENOENT"), true);
    assert.strictEqual(
      r.isLeft() && r.value[1],
      nodePath.resolve(`${TEST_DIR}/target/source/sub1/sub2/file1.txt`)
    );
    assert.strictEqual(
      r.isLeft() && r.value[2],
      nodePath.resolve(`${TEST_DIR}/target/source/sub1/sub2/file2.txt`)
    );
    assert.strictEqual(r.isRight(), false);
  });

  it("should copy files and return right with processed files", () => {
    const r = copyFiles([pathHash1, pathHash2], output);
    assert.strictEqual(pathExistsSync(output), true);
    assert.strictEqual(r.isLeft(), false);
    assert.strictEqual(
      r.isRight() && r.value[0],
      nodePath.resolve(`${TEST_DIR}/target/source/sub1/sub2/file1.txt`)
    );
    assert.strictEqual(
      r.isRight() && r.value[1],
      nodePath.resolve(`${TEST_DIR}/target/source/sub1/sub2/file2.txt`)
    );
  });
});
