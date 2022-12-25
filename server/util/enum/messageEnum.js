class MessageEnum {
  constructor(code, module, message) {
    this.code = code;
    this.module = module;
    this.message = message;
  }
}

MessageEnum.E0001 = new MessageEnum('E0001', 'REGISTER', '密碼、手機號碼、信箱或是密碼未輸入');

MessageEnum.E0002 = new MessageEnum('E0002', 'REGISTER', '該會員已註冊過');

MessageEnum.E0003 = new MessageEnum('E0003', 'LOGIN', '該會員不存在，請重新註冊')

MessageEnum.E0004 = new MessageEnum('E0004', 'LOGIN', '登入資訊錯誤，請重新輸入')

module.exports = MessageEnum;
