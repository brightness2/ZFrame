/*
 * @Author: Brightness
 * @Date: 2021-04-15 15:05:40
 * @LastEditors: Brightness
 * @LastEditTime: 2021-04-25 16:34:25
 * @Description:
 */
const basicAuth = require("basic-auth");
const { rbacService } = require("../app/service/rbacService");
const { Forbbiden } = require("../core/HttpExceptions");
const Jwt = require("../core/Jwt");
class Auth {
  constructor(version) {
    this.version = version ? version : "";
  }

  /**
   *权限校验 中间件
   *校验 token
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

      //刷新token
      let now = new Date().getTime();
      if (payload.refreshTime <= now) {
        let newToken = Jwt.genToken(payload.uid);
        ctx.newToken = newToken;
      }

      ctx.auth = { uid: payload.uid };

      await next();
    };
  }

  /**
   * 校验token和权限
   *
   * @param {*} ctx
   * @param {*} next
   * @param {*} version
   * @memberof Auth
   */
  get check() {
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

      //刷新token,当token濒临过期时
      let now = new Date().getTime();
      if (payload.refreshTime <= now) {
        let newToken = Jwt.genToken(payload.uid);
        ctx.newToken = newToken;
      }

      //校验权限
      let permissions = await rbacService.getPermissions(payload.uid);
      let action = "";
      if (this.version) {
        action = ctx.request.url.split(this.version)[1];
      } else {
        action = ctx.request.url;
      }
      let passFlag = false;
      for (let i of permissions) {
        if (i.action == action) {
          passFlag = true;
          break;
        }
      }
      if (!passFlag) {
        errmsg = "权限不足";
        throw new Forbbiden(errmsg);
      }

      //上下文保存user id
      ctx.auth = { uid: payload.uid };

      await next();
    };
  }
}

module.exports = { Auth };
