/*
 * @Author: Brightness
 * @Date: 2021-04-09 15:18:31
 * @LastEditors: Brightness
 * @LastEditTime: 2021-04-20 12:04:55
 * @Description:配置文件
 */
const path = require("path");

const config = {
  //系统配置
  version: "v1",
  routerDir: `${process.cwd()}/app/api`,
  env: "dev", // prod
  staticDir: "static", //
  pathSep: path.sep, //路径分隔符
  dir: {
    root: `${process.cwd()}`,
  },
  //token 配置
  security: {
    secretKey: "675CE91B0F8462D0B3B2DDD84EC238CC",
    expiresIn: 3600, //过期时间,单位秒
    refreshIn: 3300, //刷新时间,需要小于过期时间,单位秒
  },
  //文件缓存
  fileCache: {
    dir: "runtime/cache",
  },
};

module.exports = config;
