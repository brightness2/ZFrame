/*
 * @Author: Brightness
 * @Date: 2021-04-09 15:50:56
 * @LastEditors: Brightness
 * @LastEditTime: 2021-04-19 17:54:13
 * @Description:
 */
const Router = require("koa-router");
const TestValidator = require("../../validators/testValidator");
const { AdminObj } = require("../../dbobj/dbobj");
const { returnSuccess, returnData } = require("../../../lib/helper");
const { basicAuthEncode } = require("../../../core/util");
const { Auth } = require("../../../middleware/Auth");
const apiLevel = require("../../../config/apiLevel");
const { Admin } = require("../../model/Admin");
const Jwt = require("../../../core/jwt");
const { logger, accessLogger } = require("../../../logger");

const router = new Router();
///////////////////////
router.get("/test1/:t", (ctx, next) => {
  /**参数获取 */

  // let pathP = ctx.params;
  // console.log("url参数", pathP);

  // let get = ctx.request.query;
  // console.log("get参数", get);

  // let post = ctx.request.body;
  // console.log("post参数", post);

  // let headers = ctx.request.headers;
  // console.log("headers参数", headers);

  /**数据输出 */
  ctx.body = "test1";

  /**业务异常抛出 */
  throw new errors.BusinessError("业务gfgf", 1000);
  // throw new Error("手动抛出");
});
//////////////////////////////
router.post("/test2", async (ctx, next) => {
  //校验数据
  let v = await new TestValidator().validate(ctx);
  //获取参数
  let id = v.get("body.ids"); //post
  // let id = v.get("query.ids");//get
  // let id = v.get("path.ids");//path
  // let id = v.get("header.ids");//header
  ctx.body = id;
  returnSuccess("校验通过");
});
///////////////////////////////
router.get("/test3", async (ctx, next) => {
  //使用ZDbobj 进行数据库操作

  let adminObj = new AdminObj();
  adminObj.addParams({ name: "h" });
  let list = await adminObj.setQuery();
  // console.log(list);
  ctx.body = list;
});
////////////////////////////
router.get("/test4", (ctx, next) => {
  let token = Jwt.genToken(1, Auth.USER);
  returnData(ctx, token);
});
///////////////////////
// token 校验
router.get("/test5", new Auth().m, (ctx, next) => {
  returnData(ctx, ctx.auth);
});
///////////////////////////
// 权限校验
router.get("/test6", new Auth(apiLevel.admin).m, (ctx, next) => {
  ctx.body = "test6";
});
///////////////
//Authorization 加密
router.get("/test7", (ctx, next) => {
  ctx.body = basicAuthEncode("jkdjfkdkfdk");
});

/////////////
//model 获取数据
router.get("/test8", async (ctx, next) => {
  let rows = await Admin.fetchAll();
  let row = await new Admin({ id: 1 }).fetch();
  row = await new Admin().where("id", ">", 1).fetch();
  returnData(ctx, row);
});
///////////////////////
//日志使用
router.get("/test9", (ctx, next) => {
  logger.info("logger info test");
  logger.warn("logger warn test");
  logger.error("logger error test");
});
let arr = __dirname.split(config.pathSep);
router.prefix = arr[arr.length - 1] + "/testRun";
module.exports = router;
