const users = require('../models').users;
const apiFormatter = require('../util/helper/index.js').apiFormatter;
const MessageEnum = require('../util/enum/messageEnum.js');
const jwt = require("jsonwebtoken");
const dayjs = require('dayjs');

const SECRET = 'cloud_invoice_jwt_key'

module.exports = {
  register(req, res) {
    const { phone, email, pwd } = req.body;

    return users
      .create({
        phone: phone,
        email: email,
        pwd: pwd
      })
      .then((todo) => res.status(200).send(todo))
      .catch((error) => {
        res.json(apiFormatter({ code: 400, message: error.errors[0].message }));
      });
  },
  async login(req, res) {
    const { phone, email, pwd } = req.body;
    const user = await users.findOne({
      where: {
        phone,
        email,
      }
    });

    // Check to see if user is in db
    if (!user) {
      res.json(apiFormatter({ code: MessageEnum.E0003.code, message: MessageEnum.E0003.message }));
    }

    const isPasswordValid = user.authenticate(pwd);

    if (!isPasswordValid) {
      res.json(apiFormatter({ code: MessageEnum.E0004.code, message: MessageEnum.E0004.message }));
    }

    const token = jwt.sign({ phone: user.phone, email: user.email }, SECRET, {
      expiresIn: 3600 // 1 hours
    });

    await users.update(
      {
        token: token,
        token_exp_date: dayjs().add(1, 'hour').format()
      },
      {
        where: {
          phone,
          email,
        }
      });

    const userJson = user.toJSON();

    res.json(apiFormatter({ code: 200, message: { user: userJson, token: token } }));
  }
};
