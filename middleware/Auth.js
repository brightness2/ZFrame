/*
 * @Author: Brightness
 * @Date: 2021-04-15 15:05:40
 * @LastEditors: Brightness
 * @LastEditTime: 2021-04-15 17:37:58
 * @Description:
 */
const basicAuth = require("basic-auth");
const jwt = require("jsonwebtoken");
const apiLevel = require("../config/apiLevel");
const { Forbbiden } = require("../core/HttpExceptions");
class Auth {
  constructor(level) {
    Auth.USER = 8;
    Auth.ADMIN = 16;
    Auth.SUPER_ADMIN = 32;
    this.level = level || apiLevel.default;
  }

  get m() {
    return async (ctx, next) => {
      //检查token
      const userToken = basicAuth(ctx.req);
      let errmsg = "token 不合法";
      if (!userToken || !userToken.name) {
        throw new Forbbiden(errmsg);
      }
      try {
        var payload = jwt.verify(
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

      ctx.auth = { uid: payload.uid, scope: payload.scope };

      await next();
    };
  }
}

module.exports = { Auth };
