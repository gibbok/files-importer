import assert = require("assert");
import * as fs from "fs";
import { tmpdir } from "os";
import * as path from "path";
import { BAD_PATH, createFile, removeFile, TEST_DIR } from "../src/test-common";

const file = path.join(TEST_DIR, "file.txt");

describe("createFile", () => {
  afterAll(() => removeFile(TEST_DIR));

  it("should create the file", () => {
    assert(!fs.existsSync(file));
    // tslint:disable-next-line:no-expression-statement
    createFile(file);
    assert(fs.existsSync(file));
    assert.strictEqual(fs.readFileSync(file, "utf8"), "hello!");
  });
});

describe("removeFile", () => {
  afterAll(() => removeFile(TEST_DIR));

  it("should remove the file", () => {
    // tslint:disable-next-line:no-expression-statement
    createFile(file);
    assert(fs.existsSync(file));
    // tslint:disable-next-line:no-expression-statement
    removeFile(file);
    assert(!fs.existsSync(file));
  });
});

describe("TEST_DIR", () => {
  it("should return the temporary directory", () => {
    assert.strictEqual(TEST_DIR, `${path.join(tmpdir())}/files-importer`);
  });
});

describe("BAD_PATH", () => {
  it("should return an invalid path", () => {
    assert.strictEqual(BAD_PATH, "./invalid-path");
  });
});
