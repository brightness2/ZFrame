/*
 * @Author: Brightness
 * @Date: 2021-04-16 14:41:34
 * @LastEditors: Brightness
 * @LastEditTime: 2021-04-16 15:53:08
 * @Description:Admin model
 */
const { bookshelf } = require("../../lib/baseMode");
const Admin = bookshelf.model("Admin", { tableName: "admin" });

module.exports = {
  Admin,
};
