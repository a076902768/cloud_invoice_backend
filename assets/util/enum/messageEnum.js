class MessageEnum {
  constructor(code, message) {
    this.code = code;
    this.message = message;
  }
}

MessageEnum.M0001 = new MessageEnum('M0001', '密碼、手機號碼、信箱或是密碼未輸入');

MessageEnum.M0002 = new MessageEnum('M0002', '該會員已註冊過');

MessageEnum.M0003 = new MessageEnum('M0003', '該會員不存在，請重新註冊');

MessageEnum.M0004 = new MessageEnum('M0004', '登入資訊錯誤，請重新輸入');

MessageEnum.M0005 = new MessageEnum('M0005', 'TOKEN過期，請重新登入');

MessageEnum.M0006 = new MessageEnum('M0006', '尚未綁定財政部資料');

module.exports = MessageEnum;
