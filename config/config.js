/*
 * @Author: Brightness
 * @Date: 2021-04-09 15:18:31
 * @LastEditors: Brightness
 * @LastEditTime: 2021-04-15 08:39:00
 * @Description:配置文件
 */
const path = require("path");

const config = {
  //系统配置
  version: "v1",
  routerDir: `${process.cwd()}/app/api`,
  env: "dev", // prod
  staticDir: "static", //
  pathSep: path.sep,
  dir: {
    root: `${process.cwd()}`,
  },
  security: {
    secretKey: "675CE91B0F8462D0B3B2DDD84EC238CC",
    expiresIn: 3600 * 24 * 30, //一个月
  },
};

module.exports = config;
