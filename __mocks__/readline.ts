// tslint:disable
// module.exports = {
//   createInterface: jest.fn().mockReturnValue({
//       question: jest.fn()
//           .mockImplementationOnce((_questionText, cb) => cb('y'))
//       })
//   })
// };


module.exports ={
  createInterface :jest.fn().mockReturnValue({
    question:jest.fn().mockImplementationOnce((_questionTest, cb)=> cb('y'))
  })
}
