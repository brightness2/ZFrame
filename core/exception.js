/*
 * @Author: Brightness
 * @Date: 2021-04-09 16:47:01
 * @LastEditors: Brightness
 * @LastEditTime: 2021-04-09 17:44:31
 * @Description:异常中间件
 */
const BusinessError = require("./BusinessError");
const catchError = async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    // 进行异常的处理
    if (e instanceof BusinessError) {
      ctx.body = {
        msg: e.message,
        request: `${ctx.method} ${ctx.path}`,
        data: {
          code: e.errorCode,
          errmsg: e.msg,
          result: [],
        },
      };
      ctx.status = e.code;
    } else {
      if (global.config.env.toLowerCase() == "dev") {
        throw e;
      } else {
        //写入日记
        //todo...
        // console.error("捕获到系统错误");
        ctx.body = {
          msg: e.message,
          data: {},
          request: `${ctx.method} ${ctx.path}`,
        };
        ctx.status = 500;
      }
    }
  }
};

module.exports = catchError;
