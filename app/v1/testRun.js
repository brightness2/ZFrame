/*
 * @Author: Brightness
 * @Date: 2021-04-09 15:50:56
 * @LastEditors: Brightness
 * @LastEditTime: 2021-04-09 17:46:25
 * @Description:
 */
const Router = require("koa-router");
const router = new Router();

router.get("/test1", (ctx, next) => {
  ctx.body = "test1";
  throw new global.ZError("业务错误");
});
router.prefix = "testRun";
module.exports = router;
