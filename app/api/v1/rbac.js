/*
 * @Author: Brightness
 * @Date: 2021-04-09 15:50:56
 * @LastEditors: Brightness
 * @LastEditTime: 2021-04-25 16:19:48
 * @Description:
 */
const Router = require("koa-router");
const { Forbbiden } = require("../../../core/HttpExceptions");
const { returnSuccess, returnData } = require("../../../lib/helper");
const { Auth } = require("../../../middleware/Auth");
const { rbacService } = require("../../service/rbacService");

const router = new Router();

let arr = __dirname.split(config.pathSep);
let version = arr[arr.length - 1] + "/";
router.prefix = version + "rbac";
///////////////////////
router.post("/addRole", async (ctx, next) => {
  let id = await rbacService.addRole(ctx.request.body.name);
  returnData(ctx, id);
});

router.post("/addpermission", async (ctx, next) => {
  let id = await rbacService.addpermission(
    ctx.request.body.title,
    ctx.request.body.action,
    ctx.request.body.nickname
  );
  returnData(ctx, id);
});

////////////////////////
// 测试权限
router.get("/testRbac", async (ctx, next) => {
  let data = await rbacService.getPermissions(2);
  let action = ctx.request.url.split(version)[1];
  let flag = false;
  for (let i of data) {
    if (i.action == action) {
      flag = true;
      break;
    }
  }
  if (!flag) {
    throw new Forbbiden();
  }

  returnData(ctx, "拥有该权限");
});

////////////////////////
//中间件 测试权限
router.get("/testAuth", new Auth(version).check, async (ctx, next) => {
  ctx.body = "ok";
});

module.exports = router;
