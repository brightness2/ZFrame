/*
 * @Author: Brightness
 * @Date: 2021-04-13 10:07:05
 * @LastEditors: Brightness
 * @LastEditTime: 2021-04-23 11:51:23
 * @Description: 工具集
 */
const { Base64 } = require("js-base64");
const fs = require("fs");

const findAttr = (instance, { prefix, specifiedType, filter }) => {
  // 递归函数
  function _find(instance) {
    // 基线条件（跳出递归）
    if (instance.__proto__ === null) return [];

    let names = Reflect.ownKeys(instance);
    names = names.filter((name) => {
      // 过滤掉不满足条件的属性或方法名
      return _shouldKeep(name);
    });

    return [...names, ..._find(instance.__proto__)];
  }

  function _shouldKeep(value) {
    if (filter) {
      if (filter(value)) {
        return true;
      }
    }
    if (prefix) if (value.startsWith(prefix)) return true;
    if (specifiedType)
      if (instance[value] instanceof specifiedType) return true;
  }

  return _find(instance);
};

/**
 * Authorization 加密
 * @param {*} token
 * @returns
 */
const basicAuthEncode = (str) => {
  //http 支持 Authorization，通过此传递token更安全,扩展知识，主要用于前端
  //basic-auth 加密 依赖 js-base64
  //Authorization格式 ：Basic base64(account:password)
  str = Base64.encode(str + ":");
  return "Basic " + str; //主要 Basic 后有一个空格
};

/**
 * 生成文件夹名称
 * 20180621
 * @return {*}
 */
const getUploadDirName = () => {
  const date = new Date();
  let month = Number.parseInt(date.getMonth()) + 1;
  month = month.toString().length > 1 ? month : `0${month}`;
  const dir = `${date.getFullYear()}${month}${date.getDate()}`;
  return dir;
};

/**
 * 检查文件夹路径是否存在，如果不存在则创建文件夹
 *
 * @param {*} p
 */
const checkDirExist = (p) => {
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p);
  }
};

/**
 * 获取文件的后缀
 *
 * @param {*} name
 * @return {*}
 */
const getUploadFileExt = (name) => {
  let ext = name.split(".");
  return ext[ext.length - 1];
};

/**
 * 生成文件名称
 * 1619149821676_354 时间戳_随机数 + .后缀
 * @param {*} ext
 * @return {*}
 */
const getUploadFileName = (ext) => {
  return (
    new Date().getTime() + "_" + Math.ceil(Math.random() * 400 + 10) + "." + ext
  );
};

module.exports = {
  findAttr,
  basicAuthEncode,
  getUploadDirName,
  checkDirExist,
  getUploadFileExt,
  getUploadFileName,
};
