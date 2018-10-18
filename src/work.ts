import { createHash } from "crypto";
import { Either, tryCatch } from "fp-ts/lib/Either";
import { createReadStream } from "fs-extra";
import klawSync from "klaw-sync";

export const walkSync = (
  path: string
): Either<Error, ReadonlyArray<klawSync.Item>> =>
  tryCatch(() => klawSync(path, { nodir: true }));

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
