// tslint:disable: no-expression-statement
import * as assert from "assert";
import { IO } from "fp-ts/lib/IO";
import {
  logError,
  logInfo,
  logSuccess,
  withPrefix,
  withPrefixError,
  withPrefixInfo,
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

describe("withPrefixError", () => {
  it("should add error prefix", () => {
    const str = withPrefixError("m");
    assert.strictEqual(str, "file-importer: error: m");
  });
});

describe("withPrefixInfo", () => {
  it("should add info prefix", () => {
    const str = withPrefixInfo("m");
    assert.strictEqual(str, "file-importer: info: m");
  });
});

const testConsoleLog = (fn: (a: string) => IO<void>, message: string) => {
  const spy = jest.spyOn(global.console, "log").mockImplementation(() => ({}));
  fn("message").run();
  expect(spy).toHaveBeenCalled();
  expect(spy.mock.calls[0][0]).toContain(message);
  spy.mockReset();
};

describe("logSuccess", () => {
  it("should log in console with prefix", () => {
    testConsoleLog(logSuccess, "file-importer: success: message");
  });
});

describe("logError", () => {
  it("should log in console with error prefix", () => {
    testConsoleLog(logError, "file-importer: error: message");
  });
});

describe("logInfo", () => {
  it("should log in console with info prefix", () => {
    testConsoleLog(logInfo, "file-importer: info: message");
  });
});
