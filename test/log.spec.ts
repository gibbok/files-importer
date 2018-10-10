// tslint:disable: no-expression-statement
import * as assert from "assert";
import {
  logSuccess,
  withPrefix,
  withPrefixError,
  withPrefixSuccess
} from "../src/log";

describe("withPrefix", () => {
  it("should add app prefix", () => {
    const str = withPrefix("x")("y");
    assert.strictEqual(str, "file-importer: x: y");
  });
});

describe("withPrefixSuccess", () => {
  it("should add success prefix", () => {
    const str = withPrefixSuccess("m");
    assert.strictEqual(str, "file-importer: success: m");
  });
});

describe("withPrefixSuccess", () => {
  it("should add error prefix", () => {
    const str = withPrefixError("m");
    assert.strictEqual(str, "file-importer: error: m");
  });
});

describe("logSuccess", () => {
  it("should print in console adding a prefix", () => {
    const spy = jest
      .spyOn(global.console, "log")
      .mockImplementation(() => ({}));
    logSuccess("success").run();
    expect(spy).toHaveBeenCalled();
    expect(spy.mock.calls[0][0]).toContain("file-importer: success");
    spy.mockReset();
  });
});
