const threePartyApi = require('@/assets/api/threePartyApi.js');

module.exports = {
  async getWinningList(req, res) {
    console.log(req.body);
    const { invTerm } = req.body;
    const result = await threePartyApi.getWinningList({ invTerm });

    console.log(result);

    if (result.code === '200') {
      const obj = { ...result }
      delete obj.code;
      delete obj.v;
      delete obj.msg;
      delete obj.timeStamp;
      delete obj.headers;
      delete obj.updateDate;

      return res.status(200).send(obj)
    }
    
    return;
  },
};
