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

  /**
   *使用 Object.assign({}, obj) 將 obj 複製到新物件 newObj 中。

    使用 forEach() 循環遍歷 keysToRemove 陣列，並在 newObj 中使用 delete 刪除 key。

    最後回傳 newObj。
   * @param {Object} obj 原物件
   * @param {Array} keysToRemove 陣列, 要移除的屬性key.
   * @returns 
   */
  static filterObject(obj = {}, keysToRemove = []) {
    let newObj = Object.assign({}, obj);
    keysToRemove.forEach(key => delete newObj[key]);
    return newObj;
  }
};

module.exports = helper;
