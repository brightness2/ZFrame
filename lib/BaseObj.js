/*
 * @Author: Brightness
 * @Date: 2021-04-13 16:36:19
 * @LastEditors: Brightness
 * @LastEditTime: 2021-04-13 16:48:29
 * @Description: 继承ZDbobj类 扩展异常处理
 */
const ZDbobj = require("../core/ZDbobj");
const { ZDbobjException } = require("../core/HttpExceptions");

class BaseObj extends ZDbobj {
  constructor(tableName) {
    super(tableName);

    /**异常处理 */
    this._knex.on("query-error", (err, obj) => {
      if (config.env.toLowerCase() == "dev") {
        throw new ZDbobjException(
          "--SQLERR:" + err.sqlMessage + "   --SQL:" + obj.sql
        );
      } else {
        throw new ZDbobjException("数据库操作出错，请联系管理员");
      }
    });
  }
}

module.exports = BaseObj;
