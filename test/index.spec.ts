import { create } from "domain";
import { outputFileSync, removeSync} from "fs-extra";
import { fileExist } from "../src";

const TEMP_DIR = './tmp/'

const createFile = (path:string) => outputFileSync(path, "hello!");
const removeFile= (path:string) => removeSync(path)

describe("fileExist", () => {
  const msmErrPath = "path is invalid";
  const goodPath = `${TEMP_DIR}file.txt`
  const badPath = './invalid-path'

  beforeAll(() => {
    return createFile(goodPath);
  });

  afterAll(() => {
    return removeFile(TEMP_DIR);
  });

  it("should be valid for good path", () => {
    const fe = fileExist(goodPath, msmErrPath).run();
    expect(fe.value).toEqual(true);
  });

  it("should be invalid for bad path", () => {
    const fe = fileExist(badPath, msmErrPath).run();
    expect(fe.value).toEqual(msmErrPath);
  });
});
