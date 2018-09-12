import { create } from "domain";
import * as fs from "fs-extra";
import { fileExist } from "../src";

const createFile = (path:string) => fs.outputFileSync(path, "hello!");

describe("fileExist", () => {
  beforeAll(() => {
    return createFile('./tmp/file.txt');
  });

  const errorPath = "path is invalid";

  it("should be valid for valid path", () => {
    const fe = fileExist("test", "test").run();
    expect(fe.value).toEqual(true);
  });

  it("should be invalid for invalid path", () => {
    const fe = fileExist("invalid-path", errorPath).run();
    expect(fe.value).toEqual("path is invalid");
  });
});
