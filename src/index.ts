import { IO } from "fp-ts/lib/IO";
import { existsSync } from "fs";

const log = <T>(obj: T): IO<void> =>
  // tslint:disable-next-line:no-console
  new IO(() => console.log(JSON.stringify(obj)));

const fileExist = (path: string): IO<boolean> => new IO(() => existsSync(path));

const program = () => fileExist("test").chain(log);

// tslint:disable-next-line:no-expression-statement
program().run();

// tslint:disable-next-line:no-console
console.log("hello!");
