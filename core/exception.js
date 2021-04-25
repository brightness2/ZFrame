/*
 * @Author: Brightness
 * @Date: 2021-04-09 16:47:01
 * @LastEditors: Brightness
 * @LastEditTime: 2021-04-19 17:42:50
 * @Description:异常中间件 捕获全局异常
 */
const { BusinessError } = require("./HttpExceptions");
const { logger } = require("./logger");
const catchError = async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    // 进行异常的处理
    if (e instanceof BusinessError) {
      let obj = {
        code: e.errorCode,
        msg: e.msg,
        request: `${ctx.method} ${ctx.path}`,
        data: e.data,
      };
      //存在新token则赋值输出
      if (ctx.newToken) {
        obj.newToken = ctx.newToken;
        ctx.newToken = "";
      }
      ctx.body = obj;
      ctx.status = e.code;
    } else {
      logger.error(e);
      if (global.config.env.toLowerCase() == "dev") {
        throw e;
      }

      //写入日记
      //todo...
      // console.error("捕获到系统错误");
      ctx.body = {
        code: e.errorCode,
        msg: "系统出错",
        request: `${ctx.method} ${ctx.path}`,
        data: [],
      };
      ctx.status = 500;
    }
  }
};

module.exports = catchError;
