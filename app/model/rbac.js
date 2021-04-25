/*
 * @Author: Brightness
 * @Date: 2021-04-23 16:19:43
 * @LastEditors: Brightness
 * @LastEditTime: 2021-04-25 15:01:18
 * @Description:权限
 */
const { bookshelf } = require("../../lib/baseMode");

const UserModel = bookshelf.model("User", {
  tableName: "user",
  hidden: ["password"],
});

const RoleModel = bookshelf.model("Role", { tableName: "role" });
const PermissionModel = bookshelf.model("Permission", {
  tableName: "permission",
});
const UserRoleModel = bookshelf.model("UserRole", {
  tableName: "user_role",
});
const RolePermissionModel = bookshelf.model("RolePermission", {
  tableName: "role_permission",
});

module.exports = {
  UserModel,
  RoleModel,
  PermissionModel,
  UserRoleModel,
  RolePermissionModel,
};
