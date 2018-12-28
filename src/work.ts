/* tslint:disable:no-let no-expression-statement no-if-statement */
import { createHash } from "crypto";
import { head, lefts, zipWith } from "fp-ts/lib/Array";
import { Either, left, right } from "fp-ts/lib/Either";
import { identity } from "fp-ts/lib/function";
import { fromNullable } from "fp-ts/lib/Option";
import { closeSync, copySync, openSync, readSync } from "fs-extra";
import klawSync from "klaw-sync";
import { difference, intersection } from "ramda";
import { Errors, PathHashList } from "./types";

export const walkSync = (p: string): Either<Errors, ReadonlyArray<string>> => {
  try {
    return right(klawSync(p, { nodir: true }).map(({ path }) => path));
  } catch (e) {
    return left([`cannot walk the file system ${e.message}`]);
  }
};

export const mkPathHashList = (
  walkedPaths: ReadonlyArray<string>
): Either<Errors, PathHashList> => {
  const paths = walkedPaths.map(identity);
  const hashes = paths.map(md5);
  const hasError = hashes.some(x => x.isLeft());
  return hasError
    ? left([head(lefts(hashes)).getOrElse("error")])
    : right(
        zipWith(paths, hashes, (path: string, hash: Either<string, string>) => ({
          path,
          hash: hash.fold(identity, identity)
        }))
      );
};

export const md5 = (path: string): Either<Error["message"], string> => {
  const BUFFER_SIZE = 8192;
  let fd: number | undefined;
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
    fromNullable(fd).mapNullable(closeSync);
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
): Either<Errors, ReadonlyArray<string>> => {
  const processed = include.map(({ path }) => {
    let destination = "";
    for (let i = 0; i < path.length; i++) {
      if (path[i] !== target[i]) {
        destination = path.substring(i);
        break;
      }
    }
    const outputPath = `${target}/${destination}`;
    try {
      copySync(path, outputPath);
      return { path: outputPath, error: false, errorMessage: "" };
    } catch (error) {
      return { path: outputPath, error: true, errorMessage: error.message };
    }
  });
  const errors = processed.filter(x => x.error).map(y => y.errorMessage);
  const successes = processed.filter(x => !x.error).map(y => y.path);
  return errors.length >= 1 ? left(errors.concat(successes)) : right(successes);
};
