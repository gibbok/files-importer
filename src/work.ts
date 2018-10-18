import { createHash } from "crypto";
import { Either, left, right } from "fp-ts/lib/Either";
import { IO } from "fp-ts/lib/IO";
import { createReadStream } from "fs-extra";
import klawSync from "klaw-sync";
import { logError } from "./log";

export const walkSync = (
  path: string
): Either<IO<void>, ReadonlyArray<klawSync.Item>> => {
  try {
    return right(klawSync(path, { nodir: true }));
  } catch (e) {
    return left(logError(e.message));
  }
};

// TODO return a fp-ts task
export const md5 = (path: string) =>
  new Promise<string>((resolve, reject) => {
    const hash = createHash("md5");
    const rs = createReadStream(path);
    // tslint:disable-next-line:no-expression-statement
    rs.on("error", reject);
    // tslint:disable-next-line:no-expression-statement
    rs.on("data", chunk => hash.update(chunk));
    // tslint:disable-next-line:no-expression-statement
    rs.on("end", () => resolve(hash.digest("hex")));
  });
