/*
 * @Author: Brightness
 * @Date: 2021-04-09 16:52:40
 * @LastEditors: Brightness
 * @LastEditTime: 2021-04-13 11:42:18
 * @Description:业务异常类，自定义异常
 */
class BusinessError extends Error {
  constructor(msg = "未定义错误", errorCode = -1, code = 200) {
    super();
    this.msg = msg;
    this.errorCode = errorCode;
    this.code = code;
  }
}

class ParameterException extends BusinessError {
  constructor(msg = "参数错误", errorCode = -1, code = 200) {
    super(msg, errorCode, code);
  }
}

module.exports = {
  BusinessError,
  ParameterException,
};
