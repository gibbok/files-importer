// tslint:disable:no-object-mutation no-expression-statement
module.exports = {
  createInterface: jest.fn().mockReturnValue({
    question: jest.fn().mockImplementationOnce((_questionTest, cb) => cb("y")),
    close: jest.fn().mockImplementationOnce(() => undefined)
  })
};
