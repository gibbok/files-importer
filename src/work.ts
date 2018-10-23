import { createHash } from "crypto";
import { Either, left as eLeft, right as eRight } from "fp-ts/lib/Either";
import { IO } from "fp-ts/lib/IO";
import { IOEither, left, right } from "fp-ts/lib/IOEither";
import { closeSync, openSync, readSync } from "fs-extra";
import klawSync from "klaw-sync";

export const walkSync = (
  path: string
): Either<string, ReadonlyArray<klawSync.Item>> => {
  try {
    return eRight(klawSync(path, { nodir: true }));
  } catch (e) {
    return eLeft(`cannot walk the file system ${e.message}`);
  }
};

export const md5 = (path: string): IOEither<string, string> => {
  const BUFFER_SIZE = 8192;
  // tslint:disable-next-line:no-let
  let fd;
  try {
    // tslint:disable-next-line:no-expression-statement
    fd = openSync(path, "r");
    const buffer = Buffer.alloc(BUFFER_SIZE);
    const hash = createHash("md5");
    // tslint:disable-next-line:no-let
    let bytesRead;
    do {
      // tslint:disable-next-line:no-expression-statement
      bytesRead = readSync(fd, buffer, 0, BUFFER_SIZE, 0);
      // tslint:disable-next-line:no-expression-statement
      hash.update(buffer.slice(0, bytesRead));
    } while (bytesRead === BUFFER_SIZE);
    return right(new IO(() => hash.digest("hex")));
  } catch (error) {
    return left(new IO(() => error.message));
  } finally {
    // tslint:disable-next-line:no-if-statement
    if (fd !== undefined) {
      // tslint:disable-next-line:no-expression-statement
      closeSync(fd);
    }
  }
};

// export const md5 = (path: string): Either<string, string> => {
//   const BUFFER_SIZE = 8192;
//   // tslint:disable-next-line:no-let
//   let fd;
//   try {
//     // tslint:disable-next-line:no-expression-statement
//     fd = openSync(path, "r");
//     const buffer = Buffer.alloc(BUFFER_SIZE);
//     const hash = createHash("md5");
//     // tslint:disable-next-line:no-let
//     let bytesRead;
//     do {
//       // tslint:disable-next-line:no-expression-statement
//       bytesRead = readSync(fd, buffer, 0, BUFFER_SIZE, 0);
//       // tslint:disable-next-line:no-expression-statement
//       hash.update(buffer.slice(0, bytesRead));
//     } while (bytesRead === BUFFER_SIZE);
//     return right(hash.digest("hex"));
//   } catch (error) {
//     return left(error.message);
//   } finally {
//     // tslint:disable-next-line:no-if-statement
//     if (fd !== undefined) {
//       // tslint:disable-next-line:no-expression-statement
//       closeSync(fd);
//     }
//   }
// };
