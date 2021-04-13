<!--
 * @Author: Brightness
 * @Date: 2021-04-09 13:33:15
 * @LastEditors: Brightness
 * @LastEditTime: 2021-04-13 17:01:07
 * @Description:
-->

## ZFrmae

基于 koa 的 api 接口框架

## 核心文件

core/init.js 初始化文件
core/exception.js 全局异常捕获方法
core/HttpExceptions.js 全局业务异常类
core/util.js 工具集
core/ZValidator.js 基础校验类，适用 koa 文档 https://www.npmjs.com/package/validator
core/ZDbobj.js 基础数据库操作类 ，基于 knex

## 配置文件

config/config.js

## 中间件文件夹

middleware

## 增加中间件

middleware/BaseObj.js 继承 ZDbobj 类，扩展了异常处理

## 路由文件夹

app/api

## 静态文件夹

static

## 入口文件

index.js
