// tslint:disable: no-expression-statement
import * as assert from "assert";
import { logSuccess, withPrefix } from "../src/log";

describe("withPrefix", () => {
  it("should add a prefix to a string", () => {
    const str = withPrefix("m");
    assert.strictEqual(str, "file-importer: m");
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
