// tslint:disable: no-expression-statement
import * as assert from "assert";
import { logger, success, withPrefix } from "../src/log";

describe("loggger", () => {
  it("should log", () => {
    const spy = jest.spyOn(console, "log");
    logger("message").run();
    expect(console.log).toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe("withPrefix", () => {
  it("should add prefix", () => {
    const str = withPrefix("m");
    assert.equal(str, `\n m`);
  });
});

describe("success", () => {
  it("should prefix success message", () => {
    const str = success("m");
    assert.equal(str.includes(`\n`), true);
  });
});
