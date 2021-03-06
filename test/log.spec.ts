// tslint:disable: no-expression-statement
import * as assert from "assert";
import { IO } from "fp-ts/lib/IO";
import {
  logError,
  logErrors,
  logInfo,
  logInfos,
  logMessages,
  logReport,
  logSuccess,
  logSuccesses,
  withPrefix,
  withPrefixError,
  withPrefixInfo,
  withPrefixSuccess
} from "../src/log";

describe("withPrefix", () => {
  it("should prefix a string", () => {
    const str = withPrefix("x")("y");
    assert.strictEqual(str, "file-importer: x: y");
  });
});

describe("withPrefixSuccess", () => {
  it("should prefix with `success` a string", () => {
    const str = withPrefixSuccess("m");
    assert.strictEqual(str, "file-importer: success: m");
  });
});

describe("withPrefixError", () => {
  it("should prefix with `error` a string", () => {
    const str = withPrefixError("m");
    assert.strictEqual(str, "file-importer: error: m");
  });
});

describe("withPrefixInfo", () => {
  it("should prefix with `info` a string", () => {
    const str = withPrefixInfo("m");
    assert.strictEqual(str, "file-importer: info: m");
  });
});

const testConsoleLogRun = (fn: (a: string) => IO<void>, message: string) => {
  const spy = jest.spyOn(global.console, "log").mockImplementation(() => ({}));
  fn(message).run();
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

const testConsoleLog = (fn: any, times: number) => {
  const spy = jest.spyOn(global.console, "log").mockImplementation(() => ({}));
  fn();
  expect(spy).toHaveBeenCalledTimes(times);
  spy.mockReset();
};

describe("logSuccess", () => {
  it("should log to console with `success` prefix", () => {
    testConsoleLogRun(logSuccess, "file-importer: success: message");
  });
});

describe("logError", () => {
  it("should log to console with `error` prefix", () => {
    testConsoleLogRun(logError, "file-importer: error: message");
  });
});

describe("logInfo", () => {
  it("should log to console with `info` prefix", () => {
    testConsoleLogRun(logInfo, "file-importer: info: message");
  });
});

describe("logErrors", () => {
  it("should log to console messages with `error` prefixes", () => {
    testConsoleLogs(logErrors, ["error 1", " error 2"]);
  });
});

describe("logSuccesses", () => {
  it("should log to console messages with `success` prefixes", () => {
    testConsoleLogs(logSuccesses, ["success 1", " success 2"]);
  });
});

describe("logInfos", () => {
  it("should log to console messages with `infos` prefixes", () => {
    testConsoleLogs(logInfos, ["info 1", " info 2"]);
  });
});

describe("logMessages", () => {
  it("should log to console messages with prefixes", () => {
    testConsoleLogs(logMessages(logError), ["error 1", " error 2"]);
  });
});

describe("logReport", () => {
  it("should log to console no files found", () => {
    testConsoleLog(() => logReport([]), 1);
  });

  it("should log to console files found", () => {
    const pathHash = {
      hash: "c4ca4238a0b923820dcc509a6f75849b",
      path: "./source/file1.txt"
    };
    testConsoleLog(() => logReport([pathHash]), 2);
  });
});
