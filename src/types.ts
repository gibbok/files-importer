export type Errors = ReadonlyArray<string>;

export type ErrorWithMessage = Readonly<{ message: string }>;

export type PathSourceTarget = {
  source: string;
  target: string;
};

export type PathHash = { path: string; hash: string };

export type PathHashList = ReadonlyArray<PathHash>;
