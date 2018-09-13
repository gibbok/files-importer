import { outputFileSync, removeSync } from "fs-extra";
import { fileExist, walkSync } from "../src";
import { join} from 'path'
import { tmpdir} from 'os'

const TEST_DIR = join(tmpdir(), 'files-importer')

const createFile = (path: string) => outputFileSync(path, "hello!");
const removeFile = (path: string) => removeSync(path)

describe("fileExist", () => {
  const msmErrPath = "path is invalid";
  const goodPath = `${TEST_DIR}file.txt`
  const badPath = './invalid-path'

  beforeAll(() => createFile(goodPath))

  afterAll(() => removeFile(TEST_DIR))

  it("should be valid for good path", () => {
    const fe = fileExist(goodPath, msmErrPath).run();
    expect(fe.value).toEqual(true);
  });

  it("should be invalid for bad path", () => {
    const fe = fileExist(badPath, msmErrPath).run();
    expect(fe.value).toEqual(msmErrPath);
  });



});


describe("walkSynch", () => {
  const files = [
    `${TEST_DIR}file1.txt`,
    `${TEST_DIR}file2.txt`,
    `${TEST_DIR}/sub/file3.txt`,
    `${TEST_DIR}/sub/file4.txt`,
    `${TEST_DIR}/sub/sub/file5.txt`,
    `${TEST_DIR}/sub/sub/file6.txt`,
  ]

  beforeAll(() => files.map(createFile))

  afterAll(() => removeFile(TEST_DIR))

  it('should create list of path', ()=> {
    const ws = walkSync(TEST_DIR)
    expect(ws).toEqual('hey')
  })

})
