/*
 * @Author: Brightness
 * @Date: 2021-04-16 14:37:43
 * @LastEditors: Brightness
 * @LastEditTime: 2021-04-16 15:41:43
 * @Description:bookshelf 初始化
 */
const knexConfig = require("../config/db");
const Knex = require("knex")(knexConfig);
const bookshelf = require("bookshelf")(Knex);
const { ZDbobjException } = require("../core/HttpExceptions");

Knex.on("query-error", (err, obj) => {
  if (config.env.toLowerCase() == "dev") {
    throw new ZDbobjException(
      "--SQLERR:" + err.sqlMessage + "   --SQL:" + obj.sql
    );
  } else {
    throw new ZDbobjException("数据库操作出错，请联系管理员");
  }
});

module.exports = {
  bookshelf,
};
