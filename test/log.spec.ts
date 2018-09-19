// tslint:disable: no-expression-statement
import { logger } from "../src/log";

describe("logger", () => {
  it("should log", () => {
    const spy = jest.spyOn(console, "log");
    logger("message").run();
    expect(console.log).toHaveBeenCalled();
    spy.mockRestore();
  });
});
