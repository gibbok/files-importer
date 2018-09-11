// import { IO } from "fp-ts/lib/IO";
// import { existsSync } from "fs";
// import { compose, map } from "ramda";
// const fileExist = (path: string) => new IO(() => existsSync(path));
// const print = (x: any) =>
//   new IO(() => {
//     // tslint:disable-next-line:no-console
//     console.log(x);
//     return x;
//   });
// const cat = compose(
//   // @ts-ignore
//   map(print),
//   fileExist
// );
// // tslint:disable-next-line:no-expression-statement
// cat("test");
// tslint:disable-next-line:no-console
console.log("hello!");
