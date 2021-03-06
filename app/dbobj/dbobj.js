/*
 * @Author: Brightness
 * @Date: 2021-04-13 14:34:37
 * @LastEditors: Brightness
 * @LastEditTime: 2021-04-16 14:33:43
 * @Description:ZDbobj 使用s
 */

const BaseObj = require("../../lib/BaseObj");

class AdminObj extends BaseObj {
  constructor() {
    super("admin");
  }

  /**
   * 添加查询条件
   *
   * @param {*} [params={}]
   * @memberof T
   */
  addParams(params = {}) {
    this._filterParams(params);
    if (params["id"]) {
      this._where("id", params["id"]);
    }

    if (params["name"]) {
      this._whereLike("name", params["name"]);
    }
  }
}

module.exports = {
  AdminObj,
};
