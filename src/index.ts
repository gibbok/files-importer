import { Either, left, right } from "fp-ts/lib/Either";
import { IO } from "fp-ts/lib/IO";
import { curry } from "ramda";
import { pathExistsSync} from 'fs-extra'

const m = {
  errPath: "path is invalid"
};

const log = <T>(obj: T): IO<void> =>
  // tslint:disable-next-line:no-console
  new IO(() => console.log(JSON.stringify(obj)));

export const fileExist = curry(
  (path: string, errMessage: string): IO<Either<string, boolean>> =>
    new IO(() => (!pathExistsSync(path) ? left(errMessage) : right(true)))
);

const program = () => fileExist("invalid-path", m.errPath).chain(log);

// tslint:disable-next-line:no-expression-statement
program().run();
