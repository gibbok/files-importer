/* tslint:disable:no-expression-statement */
import assert = require("assert");
import * as fs from "fs";
import { tmpdir } from "os";
import * as nodePath from "path";
import { BAD_PATH, createFile, isErrorMessage, removeFile, TEST_DIR } from "../src/utility";

const file = nodePath.join(TEST_DIR, "file.txt");

describe("createFile", () => {
  afterEach(() => removeFile(TEST_DIR));

  it("should create a file into the os", () => {
    assert(!fs.existsSync(nodePath.resolve(file)));
    createFile(file);
    assert(fs.existsSync(nodePath.resolve(file)));
    assert.strictEqual(fs.readFileSync(file, "utf8"), "file.txt");
  });
});

describe("removeFile", () => {
  afterEach(() => removeFile(TEST_DIR));

  it("should remove a file into the os", () => {
    createFile(file);
    assert(fs.existsSync(file));
    removeFile(file);
    assert(!fs.existsSync(file));
  });
});

describe("TEST_DIR", () => {
  it("should return the current temporary directory as string", () => {
    assert.strictEqual(TEST_DIR, nodePath.resolve(`${nodePath.join(tmpdir())}/files-importer`));
  });
});

describe("BAD_PATH", () => {
  it("should return an invalid path as string", () => {
    assert.strictEqual(BAD_PATH, "./invalid-path");
  });
});

describe("isErrorMessage", () => {
  it("should return true if error has a message property", () => {
    assert.strictEqual(isErrorMessage({ message: "m" }), true);
  });

  it("should return false if error has no message property", () => {
    assert.strictEqual(isErrorMessage({}), false);
  });
});
