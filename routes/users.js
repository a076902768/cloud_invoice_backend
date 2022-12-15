import express from 'express';
import helper from '../util/helper/index.js';
var router = express.Router();
import app from '../app.js';
import multer from "multer";
import MessageEnum from '../util/enum/messageEnum.js';
const upload = multer()

/* GET users listing. */
router.get('/', async (req, res, next) => {
  const sql = 'select * from userInfo';
  await app.locals.db.query(sql, function (err, { recordset }) {
    if (err) console.log(err);

    res.json(helper.apiFormatter({ code: 200, data: recordset }))
  });
});

/**
 * 驗證方法採信箱、手機皆相同代表存在，其中一個不同代表為不一樣的user
 * @param {String} email 註冊信箱
 * @param {String} phone 註冊手機
 * @returns 若該信箱和手機已存在於DB，返回true 反之返回false
 */
const findExistUser = async ({ email, phone }) => {
  const searchSql = `
  select * from userInfo 
  WHERE email = '${email}' AND phone = '${phone}';
  `;
  const { recordset } = await app.locals.db.query(searchSql);
  return !!recordset.length;
};


router.post('/register', upload.array(), async (req, res, next) => {
  let formData = req.body;
  console.log(formData);

  if (!formData.phone || !formData.email || !formData.pwd) {
    res.json(helper.apiFormatter({ code: MessageEnum.E0001.code, message: MessageEnum.E0001.message }));
    return;
  }

  if (await findExistUser(formData)) {
    res.json(helper.apiFormatter({ code: MessageEnum.E0002.code, message: MessageEnum.E0002.message }));
    return;
  }

  const sql = `
  INSERT INTO userInfo (phone, email)
  VALUES ('${String(formData.phone)}', '${formData.email}');

  UPDATE userInfo
  SET pwd = PWDENCRYPT('${formData.pwd}')
  WHERE email = '${formData.email}';
  `;
  await app.locals.db.query(sql, (err, data) => {
    console.log(data);
    if (err) console.log(err);

    res.json(helper.apiFormatter({ code: 200, data: data.recordset }))
  });
});



export default router;
