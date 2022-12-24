class MessageEnum {
  constructor(code, module, message) {
    this.code = code;
    this.module = module;
    this.message = message;
  }
}

MessageEnum.E0001 = new MessageEnum('E0001', 'REGISTER', '手機號碼、信箱或是密碼未輸入')

MessageEnum.E0002 = new MessageEnum('E0002', 'REGISTER', '該會員已註冊過')

module.exports = MessageEnum;
