<!--
 * @Author: Brightness
 * @Date: 2021-04-09 13:33:15
 * @LastEditors: Brightness
 * @LastEditTime: 2021-04-20 12:15:26
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

middleware/Auth.js token 校验拦截 依赖 jsonwebtoken 生成 jwt, basic-auth 获取 http basic auth 的 name （token） 参数
简单的权限校验，通过比较数值大小，用户的权限数值与接口权限数值比较，用户的权限数值 < 接口权限数值 无法访问
无感刷新 token,通过判断是否达到刷新时间实现

推荐 RBAC

## 数据库操作

方式一
knex
lib/BaseObj.js 继承 ZDbobj 类，扩展了异常处理,类封装

方式二
knex + bookshelf ORM

## 路由文件夹

app/api

## 静态文件夹

static

## 入口文件

index.js

## 权限校验需要完善

## 日志功能

koa-log4

## 缓存功能

lib/FileCache.js

## 模板功能将 提交到新的分支上
