import { statSync } from "fs";
import { outputFileSync, removeSync } from "fs-extra";
import { tmpdir } from "os";
import * as pathN from "path";
import { fileExist, walkSync } from "../src";

const TEST_DIR = pathN.join(tmpdir(), "files-importer");

const createFile = (path: string) => outputFileSync(path, "hello!");
const removeFile = (path: string) => removeSync(path);

describe("fileExist", () => {
  const msmErrPath = "path is invalid";
  const goodPath = `${TEST_DIR}file.txt`;
  const badPath = "./invalid-path";

  beforeAll(() => createFile(goodPath));

  afterAll(() => removeFile(TEST_DIR));

  it("should be valid for good path", () => {
    const fe = fileExist(goodPath, msmErrPath).run();
    expect(fe.value).toEqual(true);
  });

  it("should be invalid for bad path", () => {
    const fe = fileExist(badPath, msmErrPath).run();
    expect(fe.value).toEqual(msmErrPath);
  });
});

describe("walkSynch", () => {
  const fileNames: ReadonlyArray<any> = [
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
    const ws = walkSync(TEST_DIR);
    expect(ws.length).toEqual(result.length);
    expect(ws).toEqual(result);
  });
});
