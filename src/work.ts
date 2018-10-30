import { createHash } from "crypto";
import { zipWith } from "fp-ts/lib/Array";
import { Either, left, right } from "fp-ts/lib/Either";
import { closeSync, openSync, readSync } from "fs-extra";
import klawSync from "klaw-sync";

export const walkSync = (p: string): Either<string, ReadonlyArray<string>> => {
  try {
    return right(klawSync(p, { nodir: true }).map(({ path }) => path));
  } catch (e) {
    return left(`cannot walk the file system ${e.message}`);
  }
};

export const mkPathHash = (
  walkedPaths: ReadonlyArray<string>
): Either<string, ReadonlyArray<{ path: string; hash: string }>> => {
  const paths = walkedPaths.map(String);
  const hashes = paths.map(md5);
  const hasError = hashes.some(x => x.isLeft());
  return hasError
    ? left("")
    : right(
        zipWith(
          paths,
          hashes,
          (path: string, hash: Either<string, string>) => ({
            path,
            hash: hash.getOrElse("error")
          })
        )
      );
};

export const md5 = (path: string): Either<string, string> => {
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
    return right(hash.digest("hex"));
  } catch (error) {
    return left(error.message);
  } finally {
    // tslint:disable-next-line:no-if-statement
    if (fd !== undefined) {
      // tslint:disable-next-line:no-expression-statement
      closeSync(fd);
    }
  }
};

// TODO: think if IO should actually handled using IOEither
// export const md5 = (path: string): IOEither<string, string> => {
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
//     return right(new IO(() => hash.digest("hex")));
//   } catch (error) {
//     return left(new IO(() => error.message));
//   } finally {
//     // tslint:disable-next-line:no-if-statement
//     if (fd !== undefined) {
//       // tslint:disable-next-line:no-expression-statement
//       closeSync(fd);
//     }
//   }
// };
