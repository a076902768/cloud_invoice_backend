const MessageEnum = require("@/assets/util/enum/messageEnum");
const apiFormatter = require('@/assets/util/helper/index.js').apiFormatter;
const user = require('@/server/models').user;
const bcrypt = require('bcryptjs');
const { unless } = require('express-unless');
const dayjs = require('dayjs');

verifyToken = async (req, res, next) => {

  let token = req.header('Authorization')?.replace('Bearer ', '')

  /**
   * 檢查是否持有token
   */
  if (!token) {
    return res.json(apiFormatter({ code: 400, message: "未提供TOKEN" }));
  }


  /**
   * 從DB搜尋該token是否存在
   */
  const result = await user.findOne({
    where: { 
      token,
     }
  });

  if (!result) {
    return res.json(apiFormatter({ code: 400, message: "該TOKEN不存在" }));
  }

  /**
   * 驗證date1是否超過date2
   * @param {*} date1 
   * @param {*} date2 
   * @returns 若 date1 時間超過 date2 時間 回傳 true
   */
  const isDateBefore = (date1, date2) => dayjs(date1).isBefore(dayjs(date2));

  const isTokenValid = isDateBefore(dayjs().format(), result.token_exp_date);

  if (!isTokenValid) {
    return res.json(apiFormatter({ code: MessageEnum.M0005.code, message: MessageEnum.M0005.message }));
  }

  /**
   * 計算date1 和 date2之間的時間差
   * @param {*} date1 
   * @param {*} date2 
   * @returns 回傳date1 和 date2之間的時間差
   */
  const computedTimeDiff = (date1, date2) => {
    return duration = date1.diff(date2);
  }

  const diff = computedTimeDiff(dayjs(result.token_exp_date), dayjs().format());

  /**
   * 這個區間代表token快過期，須更新token_exp_date為當前日期
   * 若小於10分鐘，則更換token_exp_date
   */
  if (0 < diff && diff < 1000 * 60 * 10) {
    console.log('update token_exp_date');
    await user.update(
      {
        token_exp_date: dayjs().add(1, 'hour').format()
      },
      {
        where: {
          token
        }
      }
    );
  }

  next();
};

verifyToken.unless = unless;

const auth = {
  verifyToken: verifyToken,
};
module.exports = auth;
