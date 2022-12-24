const users = require('../models').users;
const apiFormatter = require('../util/helper/index.js').apiFormatter;

console.log('測試', users);

module.exports = {
  create(req, res) {
    const { phone, email } = req.body;

    return users
      .create({
        phone: phone,
        email: email,
      })
      .then((todo) => res.status(200).send(todo))
      .catch((error) => {
        console.log(error.parent);
        res.json(apiFormatter({ code: 400, message: error.parent.detail}));
        // res.status(400).send(error.parent.detail)
      });
  },
  // findAll(req, res) {
  //   const { phone, email } = req.body;

  //   return users
  //     .findAll({
  //       where: {
  //         phone,
  //         email
  //       }
  //     })
  //     .then((todo) => res.status(201).send(todo))
  //     .catch((error) => res.status(400).send(error));
  // }
};
