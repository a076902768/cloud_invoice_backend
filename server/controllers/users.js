const users = require('../models').users;
const apiFormatter = require('../util/helper/index.js').apiFormatter;
const MessageEnum = require('../util/enum/messageEnum.js');

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
        res.json(apiFormatter({ code: 400, message: error.errors[0].message}));
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

    const userJson = user.toJSON();

    res.json(apiFormatter({ code: 200, message: { user: userJson, token: '功能未開發...' }}));
  }
};
