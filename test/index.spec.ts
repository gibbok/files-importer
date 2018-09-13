import { statSync } from "fs";
import { outputFileSync, removeSync } from "fs-extra";
import { tmpdir } from "os";
import * as pathN from "path";
import { fileExist, walkSync } from "../src";

const TEST_DIR = pathN.join(tmpdir(), "files-importer");

const createFile = (path: string) => outputFileSync(path, "hello!");
const removeFile = (path: string) => removeSync(path);
const badPath = "./invalid-path";

describe("fileExist", () => {
  const msmErrPath = "path is invalid";
  const goodPath = `${TEST_DIR}/file.txt`;

  beforeAll(() => createFile(goodPath));

  afterAll(() => removeFile(TEST_DIR));

  it("should be valid for good path", () => {
    const fe = fileExist(msmErrPath, goodPath).run();
    expect(fe.value).toEqual(true);
  });

  it("should be invalid for bad path", () => {
    const fe = fileExist(msmErrPath, badPath).run();
    expect(fe.value).toEqual(msmErrPath);
  });
});

describe("walkSynch", () => {
  const errWalk = "err walk";
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

  it("should create path list", () => {
    const result = fileNames.map((path: string) => ({
      path,
      stats: statSync(path)
    }));
    const ws = walkSync(errWalk, TEST_DIR).run();
    expect(ws.value.length).toEqual(result.length);
    expect(ws.value).toEqual(result);
  });

  it("should return an error message if it does not walk", () => {
    const ws = walkSync(errWalk, badPath).run();
    expect(ws.value).toBe(errWalk);
  });
});
