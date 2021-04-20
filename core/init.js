/*
 * @Author: Brightness
 * @Date: 2021-04-09 15:11:10
 * @LastEditors: Brightness
 * @LastEditTime: 2021-04-20 11:59:15
 * @Description: 初始化类
 */
//引入依赖
const bodyparser = require("koa-bodyparser");
const koaStatic = require("koa-static");
const Router = require("koa-router");
const requireDirectory = require("require-directory");
const path = require("path");
const { accessLogger } = require("../logger/index");

/**
 * 初始化类
 */
class InitManager {
  static init(app) {
    InitManager.app = app;
    InitManager.loadConfig();
    InitManager.loadHttpException();
    InitManager.useMiddleware(accessLogger());
    InitManager.useMiddleware(bodyparser());
    InitManager.useMiddleware(
      koaStatic(process.cwd() + path.sep + config.staticDir)
    );
    InitManager.autoLoadRouter();
  }

  /**
   * 加载配置文件
   * @param {*} cfgPath
   */
  static loadConfig(cfgPath = "") {
    const configPath = cfgPath || path.join(process.cwd(), "/config/config.js");
    const config = require(configPath);
    global.config = config;
  }

  /**
   * 注册中间件
   * @param {*} middleware
   */
  static useMiddleware(middleware) {
    //使用bodyparser中间件
    InitManager.app.use(middleware);
  }

  /**
   * 自动加载路由
   */
  static autoLoadRouter() {
    const routerPath = config.routerDir;
    const mainRouter = new Router();
    mainRouter.get("/", (ctx, next) => {
      ctx.body = "<h1>Welcome to ZFrame</h1>";
    });
    requireDirectory(module, routerPath, {
      visit: (r) => {
        if (r instanceof Router) {
          mainRouter.use("/" + r.prefix, r.routes(), r.allowedMethods());
        }
      },
    });
    InitManager.app.use(mainRouter.routes()).use(mainRouter.allowedMethods());
  }

  /**
   * 加载全局异常类,并注册使用
   */
  static loadHttpException() {
    const catchError = require("./exception");
    const errors = require("./HttpExceptions");
    global.catchError = catchError;
    global.errors = errors;
    InitManager.app.use(catchError);
  }
}

module.exports = InitManager;
