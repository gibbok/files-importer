import { Either, left, right } from "fp-ts/lib/Either";
import { IO } from "fp-ts/lib/IO";
import { existsSync } from "fs";

const m = {
  errorPath: "path is invalid"
};

const log = <T>(obj: T): IO<void> =>
  // tslint:disable-next-line:no-console
  new IO(() => console.log(JSON.stringify(obj)));

const fileExist = (path: string): IO<Either<string, boolean>> =>
  new IO(() => (!existsSync(path) ? left(m.errorPath) : right(true)));

const program = () => fileExist("test").chain(log);

// tslint:disable-next-line:no-expression-statement
program().run();

// tslint:disable-next-line:no-console
console.log("hello!");
