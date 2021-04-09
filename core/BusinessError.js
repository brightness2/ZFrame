/*
 * @Author: Brightness
 * @Date: 2021-04-09 16:52:40
 * @LastEditors: Brightness
 * @LastEditTime: 2021-04-09 17:37:38
 * @Description:
 */
class BusinessError extends Error {
  constructor(msg = "未定义错误", errorCode = -1, code = 200) {
    super();
    this.msg = msg;
    this.errorCode = errorCode;
    this.code = code;
  }
}

module.exports = BusinessError;
