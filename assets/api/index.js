const axios = require('axios');

axios.defaults.withCredentials = true;

// axios.interceptors.response.use((response) => {
//   const res = response.data;
//   if (res.code !== '0000') {
//     if (res.code === 'E9996' || res.code === 'E9998') {
//       window.$nuxt.$sdk.logout();
//       window.$nuxt.$store.commit('user/CLEAR');
//     } else if (res.code === 'E9997') {
//       window.$nuxt.$message.error('無權限使用');
//     }
//   }
//   return response;
// });

class Api {
  // static SERVER = process.env.API_BASE;
  static SERVER = 'https://api.einvoice.nat.gov.tw';

  static TOKEN;

  static async callAxios(method, url, params, contentType, responseType) {
    const reqHeaders = {};

    reqHeaders['Content-Type'] = contentType || 'application/x-www-form-urlencoded';

    const responseTypeText = responseType || 'json';

    try {
      const { status, data, headers } = await axios({
        headers: reqHeaders,
        method,
        url: this.SERVER + url,
        data: params,
        responseType: responseTypeText,
      });

      data.headers = headers;

      return new Promise((resolve, reject) => {
        if (status === 200) {
          resolve(data);
        } else {
          reject(new Error(''));
        }
      });
    } catch (error) {
      return error;
    }
  }
}

module.exports = Api;
