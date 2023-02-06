const Api = require('./index.js');
const qs = require('qs');

class threePartyApi extends Api {
  /** 查詢中獎發票號碼清單*/
  static async getWinningList({ invTerm }) {

    const obj = {
      version: '0.2',
      action: 'QryWinningList',
      invTerm,
      UUID: process.env.UUID,
      appID: process.env.APPID
    }

    const data = qs.stringify(obj);

    const res = await this.callAxios('POST', '/PB2CAPIVAN/invapp/InvApp', data, undefined, undefined);
    return res;
  }
}

module.exports = threePartyApi;
