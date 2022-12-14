import express from 'express';
import helper from '../util/helper/index.js';
var router = express.Router();
import app from '../app.js';

/* GET home page. */
router.get('/', async function(req, res, next) {
  await app.locals.db.query('select * from userInfo', function (err, { recordset }) {
    if (err) console.log(err);

    res.json(helper.apiFormatter({ code: 200, data: recordset }))
  });
});

export default router;
