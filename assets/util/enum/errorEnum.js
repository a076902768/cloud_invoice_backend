class ErrorEnum {
  constructor(code, value) {
    this.code = code;
    this.value = value;
  }
}

ErrorEnum.E0001 = new ErrorEnum('E0001', 'UnauthorizedError');

module.exports = ErrorEnum;
