class helper {
  /**
   * @param {Number} code 要帶給前端的api code
   * @param {any} data 要帶給前端的data
   * @returns 
   */
  static apiFormatter({ code, message = "success", data }) {
    return {
      code: code,
      message: message,
      responseData: data
    }
  }
};

module.exports = helper;
