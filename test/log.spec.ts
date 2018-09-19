import * as assert from "assert";
import { logger } from "../src/log";

describe("logger", () => {
  it("should log", () => {
    const m = "message";
    const log = console.log;
    // tslint:disable-next-line:readonly-array
    const r: string[] = [];
    // tslint:disable-next-line:no-object-mutation no-expression-statement
    console.log = (a: string) => r.push(a);
    // tslint:disable-next-line:no-expression-statement
    logger(m).run();
    assert.deepEqual(r, [m]);
    // tslint:disable-next-line:no-object-mutation no-expression-statement
    console.log = log;
  });
});
