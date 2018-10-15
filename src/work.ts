import { IOEither, tryCatch } from "fp-ts/lib/IOEither";
import klawSync from "klaw-sync";

export const walkSync = (
  path: string
): IOEither<Error, ReadonlyArray<klawSync.Item>> =>
  tryCatch(() => klawSync(path, { nodir: true }));
