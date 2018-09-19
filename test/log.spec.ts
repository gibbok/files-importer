import * as assert from "assert";
import { logger } from "../src/log";

describe("logger", () => {
  it("should log", () => {
    const m = "message";
    const log = console.log;
    // tslint:disable-next-line:readonly-array
    const r: any[] = [];
    // tslint:disable-next-line:no-object-mutation
    console.log = (a: any) => r.push(a);
    // tslint:disable-next-line:no-expression-statement
    logger(m).run();
    assert.deepEqual(r, [m]);
    console.log = log;
  });
});
