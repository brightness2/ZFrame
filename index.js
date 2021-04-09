/*
 * @Author: Brightness
 * @Date: 2021-04-09 14:45:03
 * @LastEditors: Brightness
 * @LastEditTime: 2021-04-09 16:20:13
 * @Description: 应用
 */
//引入依赖
const koa = require("koa");
const InitManager = require("./core/init");
//创建应用
const app = new koa();

//初始化
InitManager.init(app);
//监听端口
InitManager.app.listen(8888);
