/*
 * @Author: Brightness
 * @Date: 2021-04-09 15:50:56
 * @LastEditors: Brightness
 * @LastEditTime: 2021-04-13 11:48:10
 * @Description:
 */
const Router = require("koa-router");
const TestValidator = require("../../validators/testValidator");
const router = new Router();

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
  throw new errors.BusinessError("业务gfgf", 1000, 404);
  // throw new Error("手动抛出");
});

router.post("/test2", async (ctx, next) => {
  //校验数据
  let v = await new TestValidator().validate(ctx);
  //获取参数
  let id = v.get("body.ids"); //post
  // let id = v.get("query.ids");//get
  // let id = v.get("path.ids");//path
  // let id = v.get("header.ids");//header
});
let arr = __dirname.split(config.pathSep);
router.prefix = arr[arr.length - 1] + "/testRun";
module.exports = router;
