/*
 * @Author: Brightness
 * @Date: 2021-04-09 15:18:31
 * @LastEditors: Brightness
 * @LastEditTime: 2021-04-13 16:34:06
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
};

module.exports = config;
