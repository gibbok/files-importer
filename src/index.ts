import { Either, left, right } from "fp-ts/lib/Either";
import { error } from "fp-ts/lib/Exception";
import { IO } from "fp-ts/lib/IO";
import { pathExistsSync } from "fs-extra";
import klawSync from "klaw-sync";

const log = <T>(obj: T): IO<void> => new IO(() => console.log(obj));

export const fileExist = (path: string): IO<Either<Error, boolean>> =>
  new IO(
    () =>
      !pathExistsSync(path) ? left(error("error path invalid")) : right(true)
  );

export const walkSync = (
  path: string
): IO<Either<Error, ReadonlyArray<klawSync.Item>>> => {
  return new IO(() => {
    try {
      return right(klawSync(path, { nodir: true }));
    } catch {
      return left(error("error cannot walk"));
    }
  });
};

const program = () => fileExist("test").chain(log);

// tslint:disable-next-line:no-expression-statement
program().run();
