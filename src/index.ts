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

export const walkSync = (path: string) => klawSync(path, { nodir: true });

const program = () => fileExist("test", m.errPath).chain(log);

// tslint:disable-next-line:no-expression-statement
program().run();
