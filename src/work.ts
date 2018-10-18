import { createHash } from "crypto";
import { Either, left, right } from "fp-ts/lib/Either";
import { TaskEither, tryCatch } from "fp-ts/lib/TaskEither";
import { createReadStream } from "fs-extra";
import klawSync from "klaw-sync";

export const walkSync = (
  path: string
): Either<string, ReadonlyArray<klawSync.Item>> => {
  try {
    return right(klawSync(path, { nodir: true }));
  } catch (e) {
    return left(`cannot walk the file system ${e.message}`);
  }
};

export const md5 = (path: string): TaskEither<string, string> => {
  const mkHash = (p: string) =>
    new Promise<string>((resolve, reject) => {
      const hash = createHash("md5");
      const rs = createReadStream(p);
      // tslint:disable-next-line:no-expression-statement
      rs.on("error", (error: Error) => reject(error));
      // tslint:disable-next-line:no-expression-statement
      rs.on("data", chunk => hash.update(chunk));
      // tslint:disable-next-line:no-expression-statement
      rs.on("end", () => {
        return resolve(hash.digest("hex"));
      });
    });
  return tryCatch<string, string>(
    () => mkHash(path).then(x => x),
    () => "cannot create md5 hash"
  );
};
