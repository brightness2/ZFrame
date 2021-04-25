/*
 * @Author: Brightness
 * @Date: 2021-04-23 16:22:30
 * @LastEditors: Brightness
 * @LastEditTime: 2021-04-24 12:08:47
 * @Description:
 */
const { bookshelf } = require("../../lib/baseMode");
const UserModel = bookshelf.model("User", {
  tableName: "user",
  hidden: ["password"],
});
module.exports = { UserModel };
