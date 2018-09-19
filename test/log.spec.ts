import * as assert from "assert";
import { logger } from "../src/log";

describe("logger", () => {
  it("should log", () => {
    const m = "message";
    const log = console.log;
    const spy = jest.spyOn(console, "log");
    // tslint:disable-next-line:no-expression-statement
    logger(m).run();
    expect(console.log).toHaveBeenCalled();
    spy.mockRestore();
  });
});
