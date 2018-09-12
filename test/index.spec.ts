import { create } from "domain";
import * as fs from "fs-extra";
import { fileExist } from "../src";

const createFile = () => {
  const file = "./tmp/file.txt";
  // tslint:disable-next-line:no-expression-statement
  fs.outputFileSync(file, "hello!");
};

describe("fileExist", () => {
  beforeEach(() => {
    return createFile();
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
