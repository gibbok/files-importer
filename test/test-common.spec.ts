import assert = require("assert");
import * as fs from "fs";
import * as path from "path";
import { createFile, removeFile, TEST_DIR } from "../src/test-common";
describe("test-common", () => {
  afterAll(() => removeFile(TEST_DIR));

  it("should create the file", () => {
    const file = path.join(
      TEST_DIR,
      Math.random() + "ts-ne",
      Math.random() + ".txt"
    );
    assert(!fs.existsSync(file));
    // tslint:disable-next-line:no-expression-statement
    createFile(file);
    assert(fs.existsSync(file));
    assert.strictEqual(fs.readFileSync(file, "utf8"), "hello!");
  });

  it("should remove the file", () => {
    const file = path.join(
      TEST_DIR,
      Math.random() + "ts-ne",
      Math.random() + ".txt"
    );
    // tslint:disable-next-line:no-expression-statement
    createFile(file);
    assert(fs.existsSync(file));
    // tslint:disable-next-line:no-expression-statement
    removeFile(file);
    assert(!fs.existsSync(file));
  });
});
