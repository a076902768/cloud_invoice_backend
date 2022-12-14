class helper {
  /**
   * @param {Number} code 要帶給前端的api code
   * @param {any} data 要帶給前端的data
   * @returns 
   */
  static apiFormatter({ code, data }) {
    return {
      code: code,
      message: "Success",
      responseData: data,
    }
  }
};

export default helper;
