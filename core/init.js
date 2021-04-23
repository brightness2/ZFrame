/*
 * @Author: Brightness
 * @Date: 2021-04-09 15:11:10
 * @LastEditors: Brightness
 * @LastEditTime: 2021-04-23 11:39:23
 * @Description: 初始化类
 */
//引入依赖
const koaBody = require("koa-body");
const koaStatic = require("koa-static");
const Router = require("koa-router");
const requireDirectory = require("require-directory");
const path = require("path");
const { accessLogger } = require("../logger/index");
const {
  getUploadFileExt,
  getUploadDirName,
  checkDirExist,
  getUploadFileName,
} = require("../core/util");
const { logger } = require("../logger/index");
/**
 * 初始化类
 */
class InitManager {
  static init(app) {
    InitManager.app = app;
    InitManager.loadConfig();
    InitManager.loadHttpException();
    InitManager.useMiddleware(accessLogger());
    InitManager.useMiddleware(
      koaBody({
        multipart: true,
        encoding: "gzip",
        formidable: {
          maxFileSize:
            (config.upload.size ? config.upload.size : 2) * 1024 * 1024, // 设置上传文件大小最大限制，默认2M
          maxFieldsSize:
            (config.upload.allSize ? config.upload.allSize : 10) * 1024 * 1024,
          uploadDir: path.join(process.cwd(), config.upload.dir),
          keepExtensions: true,
          onFileBegin: function (name, file) {
            // // 获取文件后缀
            const ext = getUploadFileExt(file.name);
            //生成保存的文件夹
            let dirName = getUploadDirName();
            // 最终要保存到的文件夹目录
            const dir = path.join(this.uploadDir, dirName);
            // 检查文件夹是否存在如果不存在则新建文件夹
            checkDirExist(dir);
            //生成文件名
            let fileName = getUploadFileName(ext);
            // 重新覆盖 file.path 属性
            file.path = `${dir}${path.sep}${fileName}`;
            //app 上下文中增加uploadPath属性
            InitManager.app.context.uploadPath = InitManager.app.context
              .uploadPath
              ? InitManager.app.context.uploadPath
              : {};
            if (InitManager.app.context.uploadPath[name]) {
              InitManager.app.context.uploadPath[name].push(
                `${dirName}/${fileName}`
              );
            } else {
              InitManager.app.context.uploadPath[name] = [
                `${dirName}/${fileName}`,
              ];
            }
          },
          onError: (err) => {
            logger.error(err);
            if (config.env.toLowerCase() == "dev") {
              console.log(err);
            } else {
              throw new global.errors.BusinessError("文件上传失败");
            }
          },
        },
      })
    );
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
