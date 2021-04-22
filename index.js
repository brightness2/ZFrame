/*
 * @Author: Brightness
 * @Date: 2021-04-09 14:45:03
 * @LastEditors: Brightness
 * @LastEditTime: 2021-04-22 14:43:15
 * @Description: 应用
 */
//引入依赖
const Koa = require("koa");
const InitManager = require("./core/init");
//创建应用
// const app = new Koa();
//使用xtemplate 模板引擎 并创建应用
var app = require("xtpl/lib/koa2")(new Koa(), {
  views: "./views",
});
//初始化
InitManager.init(app);
//监听端口
InitManager.app.listen(8888);
