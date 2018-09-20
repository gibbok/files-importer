// tslint:disable: no-expression-statement
import * as assert from "assert";
import { error, logger, success, withPrefix } from "../src/log";

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
    assert.equal(str, `\n m`);
  });
});

describe("success", () => {
  it("should add a prefix to a success string", () => {
    const str = success("m");
    assert.equal(str.includes(`\n`), true);
  });
});

describe("error", () => {
  it("should add a prefix to an error string", () => {
    const str = error("m");
    assert.equal(str.includes(`\n`), true);
  });
});
