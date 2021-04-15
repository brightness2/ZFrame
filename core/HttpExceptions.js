/*
 * @Author: Brightness
 * @Date: 2021-04-09 16:52:40
 * @LastEditors: Brightness
 * @LastEditTime: 2021-04-15 16:16:53
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

class ZDbobjException extends BusinessError {
  constructor(msg = "数据库出错", errorCode = -1, code = 200) {
    super(msg, errorCode, code);
  }
}

class Success extends BusinessError {
  constructor(msg = "操作成功", errorCode = 0, code = 201) {
    super(msg, errorCode, code);
  }
}

class Forbbiden extends BusinessError {
  constructor(msg = "没有权限", errorCode = -1, code = 403) {
    super(msg, errorCode, code);
  }
}

module.exports = {
  BusinessError,
  ParameterException,
  ZDbobjException,
  Success,
  Forbbiden,
};
