const todosController = require('@/server/controllers').todos;
const todoItemsController = require('@/server/controllers').todoItems;
const userController = require('@/server/controllers').user;
const invoiceController = require('@/server/controllers').invoice;
const apiFormatter = require('@/assets/util/helper/index.js').apiFormatter;
const MessageEnum = require('@/assets/util/enum/messageEnum.js');
const ErrorEnum = require('@/assets/util/enum/errorEnum.js');
const { auth } = require("@/middleware");
module.exports = (app) => {
  /**
   * 全域宣告middleware
   * 驗證token 
   */
  app.use(auth.verifyToken.unless({ path: ['/user/register', '/user/bindEInvoiceData', '/user/getVerifyImage', '/user/login'] }));

  /**
   * 全域宣告middleware
   * catch error message
   */
  app.use(function (err, req, res, next) {
    console.log(err?.name);
    if (err.name === ErrorEnum.E0001.value) {
      return res.json(apiFormatter({ code: MessageEnum.M0005.code, message: MessageEnum.M0005.message }));
    }
    next(err);
  });

  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome to the Todos API!',
  }));
  /**
   * 註冊的middleware
   * 註冊前需判斷email、phone皆有填
   * 其中一個沒填則擋住
   */
  const registerMiddleware = (req, res, next) => {
    const { phone, email, pwd } = req.body;
    if (!phone || !email || !pwd) {
      res.json(apiFormatter({ code: MessageEnum.M0001.code, message: MessageEnum.M0001.message }));
      return;
    }
    next();
  };

  app.post('/user/register', registerMiddleware, userController.register);

  app.get('/user/getVerifyImage', userController.getVerifyImage);

  app.post('/invoice/getWinningList', invoiceController.getWinningList);

  app.post('/user/bindEInvoiceData', userController.bindEInvoiceData);

  app.post('/user/login', userController.login);

  app.post('/user/logout', userController.logout);











  app.post('/api/todos', todosController.create);
  app.get('/api/todos', todosController.list);
  app.get('/api/todos/:todoId', todosController.retrieve);
  app.put('/api/todos/:todoId', todosController.update);
  app.delete('/api/todos/:todoId', todosController.destroy);

  app.post('/api/todos/:todoId/items', todoItemsController.create);
  app.put('/api/todos/:todoId/items/:todoItemId', todoItemsController.update);
  app.delete(
    '/api/todos/:todoId/items/:todoItemId', todoItemsController.destroy
  );
  app.all('/api/todos/:todoId/items', (req, res) => res.status(405).send({
    message: 'Method Not Allowed',
  }));
};
