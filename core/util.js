/*
 * @Author: Brightness
 * @Date: 2021-04-13 10:07:05
 * @LastEditors: Brightness
 * @LastEditTime: 2021-04-15 08:56:08
 * @Description: 工具集
 */
const jwt = require("jsonwebtoken");

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
 * 生成token
 * @param {*} uid
 * @param {*} scope
 * @returns
 */
const genToken = (uid, scope) => {
  const { secretKey, expiresIn } = global.config.security;
  let token = jwt.sign({ uid, scope }, secretKey, { expiresIn });
  return token;
};

module.exports = {
  findAttr,
  genToken,
};
