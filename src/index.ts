import { Either, left, right } from "fp-ts/lib/Either";
import { IO } from "fp-ts/lib/IO";
import { existsSync } from "fs";
import { curry } from "ramda";

const m = {
  errPath: "path is invalid"
};

const log = <T>(obj: T): IO<void> =>
  // tslint:disable-next-line:no-console
  new IO(() => console.log(JSON.stringify(obj)));

const fileExist = curry(
  (path: string, message: string): IO<Either<string, boolean>> =>
    new IO(() => (!existsSync(path) ? left(message) : right(true)))
);

const program = () => fileExist("test", m.errPath).chain(log);

// tslint:disable-next-line:no-expression-statement
program().run();
