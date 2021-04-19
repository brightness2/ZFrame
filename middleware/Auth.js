/*
 * @Author: Brightness
 * @Date: 2021-04-15 15:05:40
 * @LastEditors: Brightness
 * @LastEditTime: 2021-04-19 16:14:41
 * @Description:
 */
const basicAuth = require("basic-auth");
const apiLevel = require("../config/apiLevel");
const { Forbbiden } = require("../core/HttpExceptions");
const Jwt = require("../core/Jwt");
class Auth {
  constructor(level) {
    Auth.USER = 8;
    Auth.ADMIN = 16;
    Auth.SUPER_ADMIN = 32;
    this.level = level || apiLevel.default;
  }

  /**
   *权限校验 中间件
   *
   * @readonly
   * @memberof Auth
   */
  get m() {
    return async (ctx, next) => {
      //检查token
      const userToken = basicAuth(ctx.req); //从basic-auth中获取token，token存放在header，并借用了http的authority加密
      let errmsg = "token 不合法";
      if (!userToken || !userToken.name) {
        throw new Forbbiden(errmsg);
      }
      try {
        var payload = Jwt.verify(
          userToken.name,
          global.config.security.secretKey
        );
      } catch (error) {
        if (error.name == "TokenExpiredError") {
          errmsg = "token 令牌已过期";
        }
        throw new Forbbiden(errmsg);
      }

      if (payload.scope < this.level) {
        errmsg = "权限不足";
        throw new Forbbiden(errmsg);
      }
      //刷新token
      let now = new Date().getTime();
      if (payload.refreshTime <= now) {
        let newToken = Jwt.genToken(payload.uid, payload.scope);
        ctx.newToken = newToken;
      }

      ctx.auth = { uid: payload.uid, scope: payload.scope };

      await next();
    };
  }
}

module.exports = { Auth };
