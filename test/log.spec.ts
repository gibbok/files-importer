// tslint:disable: no-expression-statement
import * as assert from "assert";
import { logError, logger, logSuccess, withPrefix } from "../src/log";

describe("logger", () => {
  it("should log a string", () => {
    const spy = jest.spyOn(console, "log");
    logger("message").run();
    expect(console.log).toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe("withPrefix", () => {
  it("should add a prefix to a string", () => {
    const str = withPrefix("m");
    assert.strictEqual(str, `\n file-importer: m`);
  });
});

describe("logSuccess", () => {
  it("should add a prefix to a success string", () => {
    const spy = jest.spyOn(console, "log");
    logSuccess("message").run();
    expect(console.log).toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe("logError", () => {
  it("should add a prefix to an error string", () => {
    const spy = jest.spyOn(console, "log");
    logError("message").run();
    expect(console.log).toHaveBeenCalled();
    spy.mockRestore();
  });
});
