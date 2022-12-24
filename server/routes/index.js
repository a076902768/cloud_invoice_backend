const todosController = require('../controllers').todos;
const todoItemsController = require('../controllers').todoItems;
const usersController = require('../controllers').users;
const apiFormatter = require('../util/helper/index.js').apiFormatter;
const MessageEnum = require('../util/enum/messageEnum.js');

module.exports = (app) => {
  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome to the Todos API!',
  }));

  const registerMiddleware = (req, res, next) => {
    const { phone, email } = req.body;
    if (!phone|| !email) {
      res.json(apiFormatter({ code: MessageEnum.E0001.code, message: MessageEnum.E0001.message}));
      return;
    }
    next();
  };

  app.post('/users/register', registerMiddleware, usersController.create);

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
