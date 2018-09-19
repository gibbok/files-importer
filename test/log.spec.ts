// tslint:disable: no-expression-statement
import * as assert from "assert";
import { logger, withPrefix } from "../src/log";

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
    const wp = withPrefix("message");
    assert.equal(wp, "\n message");
  });
});
