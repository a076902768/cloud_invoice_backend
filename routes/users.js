import express from 'express';
// import helper from '../util/helper/index.js';
var router = express.Router();
// import app from '../app.js';

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


// router.post('/register', async function(req, res, next) {
//   const sql = "INSERT INTO userInfo (ui_name, ui_phone) VALUES ('peter', 0976055528)";
//   await app.locals.db.query(sql, function (err, { recordset }) {
//     if (err) console.log(err);

//     res.json(helper.apiFormatter({ code: 200, data: recordset }))
//   });
// });



export default router;
