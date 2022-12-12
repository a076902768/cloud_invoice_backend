import express from 'express';
import helper from '../public/javascript/helper/index.js';
var router = express.Router();
import sql from 'mssql';

const config = {
  user: 'web',
  password: '123456',
  server: 'localhost',
  database: 'cloud_invoice',
  options: {
    trustServerCertificate: true // change to true for local dev / self-signed certs
  }
};

const initialize = async () => {
  // 建立連接
  await sql.connect(config, err => {
    if (err) console.log(err);
  });
}

initialize();


/* GET home page. */
router.get('/', function(req, res, next) {
  const request = new sql.Request();
  request.query('select * from userInfo', function (err, { recordset }) {
    if (err) console.log(err);

    res.json(helper.apiFormatter({ code: 200, data: recordset }))
  });
});

export default router;
