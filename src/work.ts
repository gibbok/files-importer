/* tslint:disable:no-let no-expression-statement no-if-statement */
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
  let fd;
  try {
    fd = openSync(path, "r");
    const buffer = Buffer.alloc(BUFFER_SIZE);
    const hash = createHash("md5");
    let bytesRead;
    do {
      bytesRead = readSync(fd, buffer, 0, BUFFER_SIZE, 0);
      hash.update(buffer.slice(0, bytesRead));
    } while (bytesRead === BUFFER_SIZE);
    return right(hash.digest("hex"));
  } catch (error) {
    return left(error.message);
  } finally {
    if (fd !== undefined) {
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

export const copyFiles = (
  include: PathHashList,
  target: string
): Either<ReadonlyArray<string>, ReadonlyArray<string>> => {
  const result = include.map(({ path }) => {
    let destination = "";
    for (let i = 0; i < path.length; i++) {
      if (path[i] !== target[i]) {
        destination = path.substring(i);
        break;
      }
    }
    const output = `${target}/${destination}`;
    try {
      copySync(path, output);
      return { processed: output, error: false, message: "" };
    } catch (err) {
      return { processed: output, error: true, message: err };
    }
  });
  const errors = result.filter(x => x.error).map(y => y.message);
  const processed = result.filter(x => !x.error).map(y => y.processed);
  return errors.length > 1 ? left(errors) : right(processed);
};
