const user = require('@/server/models').user;
const apiFormatter = require('@/assets/util/helper/index.js').apiFormatter;
const MessageEnum = require('@/assets/util/enum/messageEnum.js');
const dayjs = require('dayjs');
const bcrypt = require('bcryptjs');
const { getCarrierId, getCAPTCHA } = require('@/assets/util/puppeteer/index.js');

module.exports = {
  /**
   * 會員註冊
   */
  async register(req, res) {
    const { phone, email, pwd } = req.body;

    const result = await user.findOne({ where: { phone, email } });

    if (result) {
      return res.json(apiFormatter({ code: MessageEnum.M0002.code, message: MessageEnum.M0002.message }));
    }

    const hashPwd = bcrypt.hashSync(pwd, 10);

    return user
      .create({
        phone: phone,
        email: email,
        pwd: hashPwd
      })
      .then((todo) => res.status(200).send(todo))
      .catch((error) => {
        res.json(apiFormatter({ code: 400, message: error.errors[0].message }));
      });
  },

  /**
   * 會員登入
   */
  async login(req, res) {
    const { phone, email, pwd } = req.body;
    const result = await user.findOne({
      attributes: {
        exclude: ['uid', 'token_exp_date']
      },
      where: {
        phone,
        email,
      }
    });


    // 判斷使用者是否存在於DB
    if (!result) {
      return res.json(apiFormatter({ code: MessageEnum.M0003.code, message: MessageEnum.M0003.message }));
    }

    // 判斷密碼是否相同
    const isPasswordValid = bcrypt.compareSync(pwd, result.pwd);

    if (!isPasswordValid) {
      return res.json(apiFormatter({ code: MessageEnum.M0004.code, message: MessageEnum.M0004.message }));
    }

    // 判斷會員是否有綁定財政部會員資料
    if (!result.card_encrypt || !result.card_no) {
      return res.json(apiFormatter({ code: MessageEnum.M0006.code, message: MessageEnum.M0006.message }));
    }

    const token = await bcrypt.hashSync(JSON.stringify({ phone: result.phone, email: result.email }), 10);

    /**
     * 更新user token、exp_date
     */
    await user.update(
      {
        token: token,
        token_exp_date: dayjs().add(1, 'hour').format()
      },
      {
        where: {
          phone,
          email,
        }
      }
    );

    const data = {
      created_at: result.created_at,
      updated_at: result.updated_at,
      phone: result.phone,
      email: result.email,
      token,
    }

    return res.json(apiFormatter({ code: 200, data }));
  },

  /**
   * 會員登出
   */
  async logout(req, res) {

    const token = req.header('Authorization').replace('Bearer ', '');

    await user.update(
      {
        token: null,
        token_exp_date: null
      },
      {
        where: {
          token
        }
      }
    );

    return res.json(apiFormatter({ code: 200, message: 'success' }));
  },

  /**
   * 綁定財政部資料
   */
  async bindEInvoiceData(req, res) {
    const { phone, email, card_encrypt, captcha } = req.body;
    try {
      const result = await user.findOne({
        attributes: {
          exclude: ['uid', 'token_exp_date']
        },
        where: {
          phone,
          email,
        }
      });

      // 判斷使用者是否存在於DB
      if (!result) {
        return res.json(apiFormatter({ code: MessageEnum.M0003.code, message: MessageEnum.M0003.message }));
      }

      /**
       * 若使用者已綁定財政部資料則回報錯誤訊息
       */
      if (result.card_encrypt && result.card_no) {
        return res.json(apiFormatter({ code: MessageEnum.M0007.code, message: MessageEnum.M0007.message }));
      }

      // 取得手機條碼
      const data = await getCarrierId({ phone, cardEncrypt: card_encrypt, CAPTCHA: captcha });


      /**
       * 自動登入過程中，發生驗證碼錯誤、帳密輸入錯誤，皆回報驗證錯誤error
       */
      if (!data?.carrierId2) {
        return res.json(apiFormatter({ code: MessageEnum.M0008.code, message: MessageEnum.M0008.message }));
      }

      const hashCardEncrypt = bcrypt.hashSync(card_encrypt, 10);

      await user.update(
        {
          card_encrypt: hashCardEncrypt,
          card_no: data.carrierId2
        },
        {
          where: {
            phone,
            email,
          }
        }
      );

      return res.json(apiFormatter({ code: 200, message: 'success' }));
    } catch (error) {
      console.log(error);
      return res.send(error);
    }
  },

  /**
   * 註冊驗證碼
   */
  async getVerifyImage(req, res) {
    const base64 = await getCAPTCHA();
    return res.json({ base64_image: base64 });
  },
};
