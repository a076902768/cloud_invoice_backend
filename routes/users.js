import express from 'express';
import helper from '../util/helper/index.js';
var router = express.Router();
import app from '../app.js';
import multer from "multer";
const upload = multer()

/* GET users listing. */
router.get('/', async function(req, res, next) {
  const sql = 'select * from userInfo';
  await app.locals.db.query(sql, function (err, { recordset }) {
    if (err) console.log(err);

    res.json(helper.apiFormatter({ code: 200, data: recordset }))
  });
});


router.post('/register', upload.array(), async function(req, res, next) {
  let formData = req.body;
  console.log(formData);
  console.log(formData.name);

  if (!formData.name || formData.phone || !formData.email) {
    res.json(helper.apiFormatter({ code: 'E9999', message: '名稱、手機號碼或是信箱未輸入' }));
    return;
  }

  const sql = `INSERT INTO userInfo (name, phone, email) VALUES ('${formData.name}', '${String(formData.phone)}', '${formData.email}')`;
  await app.locals.db.query(sql, function (err, data) {
    console.log(data);
    if (err) console.log(err);

    res.json(helper.apiFormatter({ code: 200, data: data.recordset }))
  });
});



export default router;
