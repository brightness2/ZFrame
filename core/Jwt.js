/*
 * @Author: Brightness
 * @Date: 2021-04-19 15:03:10
 * @LastEditors: Brightness
 * @LastEditTime: 2021-04-19 15:47:01
 * @Description: JWT 生成与解析
 */
const jwt = require("jsonwebtoken");

class Jwt {
  constructor() {}
  /**
   * 生成token
   * @param {*} uid
   * @param {*} scope
   * @returns
   */
  static genToken(uid, scope) {
    const { secretKey, expiresIn, refreshIn } = global.config.security;

    //计算刷新token的时间戳
    let refreshTime = 0;
    if (refreshIn >= expiresIn) {
      refreshTime = new Date().getTime() + (expiresIn - 10) * 1000;
    } else {
      refreshTime = new Date().getTime() + refreshIn * 1000;
    }

    let token = jwt.sign({ uid, scope, refreshTime }, secretKey, { expiresIn });
    return token;
  }

  /**
   * 验证token
   * @returns
   */
  static verify(token) {
    let payload = jwt.verify(token, global.config.security.secretKey);
    return payload;
  }
}

module.exports = Jwt;
