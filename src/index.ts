import { Either, left, right } from "fp-ts/lib/Either";
import { IO } from "fp-ts/lib/IO";
import { pathExistsSync } from "fs-extra";
import klawSync from "klaw-sync";
import { curry } from "ramda";
const m = {
  errPath: "path is invalid"
};

const log = <T>(obj: T): IO<void> => new IO(() => console.log(obj));

export const fileExist = curry(
  (path: string, errMessage: string): IO<Either<string, boolean>> =>
    new IO(() => (!pathExistsSync(path) ? left(errMessage) : right(true)))
);

export const walkSync = curry(
  (
    path: string,
    errMessage: string
  ): IO<Either<string, ReadonlyArray<klawSync.Item>>> => {
    return new IO(() => {
      try {
        return right(klawSync(path, { nodir: true }));
      } catch {
        return left(errMessage);
      }
    });
  }
);

// export const walkSync = (path: string): ReadonlyArray<klawSync.Item> => {
//   try {
//     return klawSync(path, { nodir: true });
//   } catch (err) {
//     return err;
//   }
// };

const program = () => fileExist("test", m.errPath).chain(log);

// tslint:disable-next-line:no-expression-statement
program().run();
