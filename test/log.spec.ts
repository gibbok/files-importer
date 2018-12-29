// tslint:disable: no-expression-statement
import * as assert from "assert";
import { IO } from "fp-ts/lib/IO";
import {
  logError,
  logErrors,
  logInfo,
  logInfos,
  logMessages,
  logSuccess,
  logSuccesses,
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

const testConsoleLogs = (
  fn: (a: ReadonlyArray<string>) => void,
  messages: ReadonlyArray<string>
) => {
  const spy = jest.spyOn(global.console, "log").mockImplementation(() => ({}));
  fn(messages);
  expect(spy).toHaveBeenCalledTimes(messages.length);
  spy.mockReset();
};

describe("logSuccess", () => {
  it("should log in console success with prefix", () => {
    testConsoleLog(logSuccess, "file-importer: success: message");
  });
});

describe("logError", () => {
  it("should log in console error with error prefix", () => {
    testConsoleLog(logError, "file-importer: error: message");
  });
});

describe("logInfo", () => {
  it("should log in console info with info prefix", () => {
    testConsoleLog(logInfo, "file-importer: info: message");
  });
});

describe("logErrors", () => {
  it("should log in console errors with prefixes", () => {
    testConsoleLogs(logErrors, ["error 1", " error 2"]);
  });
});

describe("logSuccesses", () => {
  it("should log in console successes with prefixes", () => {
    testConsoleLogs(logSuccesses, ["success 1", " success 2"]);
  });
});

describe("logInfos", () => {
  it("should log in console infos with prefixes", () => {
    testConsoleLogs(logInfos, ["info 1", " info 2"]);
  });
});

describe("logMessages", () => {
  it("should log in console messages with prefixes", () => {
    testConsoleLogs(logMessages(logError), ["error 1", " error 2"]);
  });
});
