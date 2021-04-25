/*
 * @Author: Brightness
 * @Date: 2021-04-23 14:42:37
 * @LastEditors: Brightness
 * @LastEditTime: 2021-04-25 15:45:23
 * @Description:权限
 */
const { Knex } = require("../../lib/baseMode");
const { ParameterException } = require("../../core/HttpExceptions");
const {
  RoleModel,
  PermissionModel,
  RolePermissionModel,
  UserRoleModel,
  UserModel,
} = require("../model/rbac");

let rbacService = {
  //添加角色
  addRole: async (name) => {
    if (!name) {
      throw new ParameterException("缺少角色名称");
    }

    return await new RoleModel({ name }).save();
  },
  //添加权限
  addpermission: async (title, action, nickname = null) => {
    if (!title || !action) {
      throw new ParameterException("缺少权限标题或操作信息");
    }

    return await new PermissionModel({ title, action, nickname }).save();
  },

  //获取权限
  getPermissions: async (userId) => {
    let sql = `    select 
    DISTINCT
    permission.* 
    from 
    user_role
    left join 
    role_permission
    on user_role.role_id = role_permission.role_id 
    LEFT JOIN
    permission
    on role_permission.permission_id = permission.id
    where 
    user_role.user_id in (`;
    sql += userId;
    sql += `);`;
    return new Promise((resolve, reject) => {
      Knex.raw(sql)
        .then((rs) => {
          resolve(rs[0]);
          // console.log(rs[0]);
          //       [
          //   TextRow {
          //     id: 5,
          //     title: '测试权限',
          //     action: 'rbac/testRbac',
          //     nickname: 'test'
          //   },
          //   TextRow {
          //     id: 6,
          //     title: '游客权限',
          //     action: 'rbac/guestRbac',
          //     nickname: 'guest'
          //   }
          // ]
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};

module.exports = {
  rbacService,
};
