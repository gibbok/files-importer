import { createHash } from "crypto";
import { head, lefts, zipWith } from "fp-ts/lib/Array";
import { Either, left, right } from "fp-ts/lib/Either";
import { identity } from "fp-ts/lib/function";
import { closeSync, copySync, openSync, readSync } from "fs-extra";
import klawSync from "klaw-sync";
import { difference, intersection } from "ramda";

export const walkSync = (p: string): Either<string, ReadonlyArray<string>> => {
  try {
    return right(klawSync(p, { nodir: true }).map(({ path }) => path));
  } catch (e) {
    return left(`cannot walk the file system ${e.message}`);
  }
};

export type PathHash = { path: string; hash: string };
export type PathHashList = ReadonlyArray<PathHash>;

export const mkPathHashList = (
  walkedPaths: ReadonlyArray<string>
): Either<string, PathHashList> => {
  const paths = walkedPaths.map(identity);
  const hashes = paths.map(md5);
  const hasError = hashes.some(x => x.isLeft());
  return hasError
    ? left(head(lefts(hashes)).getOrElse("error"))
    : right(
        zipWith(
          paths,
          hashes,
          (path: string, hash: Either<string, string>) => ({
            path,
            hash: hash.fold(identity, identity)
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

export const comparePathHashLists = (
  pathHashListSource: PathHashList,
  pathHashListTarget: PathHashList
) => ({
  include: difference(pathHashListSource, pathHashListTarget),
  exclude: intersection(pathHashListSource, pathHashListTarget)
});

/* tslint:disable:no-expression-statement no-let no-if-statement no-expression-statement */
export const copyFiles = (include: PathHashList, target: string) => {
  include.forEach(({ path }) => {
    let newPath = "";
    for (let i = 0; i < path.length; i++) {
      const isDifferent = path[i] !== target[i];
      if (isDifferent) {
        newPath = path.substring(i);
        break;
      }
    }
    try {
      const output = `${target}/${newPath}`;
      copySync(path, output);
    } catch (err) {
      console.error(err);
    }
  });
};
/* tslint:enable:no-expression-statement no-let no-if-statement */
