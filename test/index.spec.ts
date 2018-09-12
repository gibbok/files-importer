import { fileExist } from "../src";

describe("fileExist", () => {
  const errorPath = "path is invalid";

  it("should be valid for valid path", () => {
    const fe = fileExist("test", errorPath).run();
    expect(fe.value).toEqual(true);
  });

  it("should be invalid for invalid path", () => {
    const fe = fileExist("invalid-path", errorPath).run();
    expect(fe.value).toEqual("path is invalid");
  });
});
