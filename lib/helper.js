/*
 * @Author: Brightness
 * @Date: 2021-04-13 17:42:32
 * @LastEditors: Brightness
 * @LastEditTime: 2021-04-15 14:57:03
 * @Description:帮助函数
 */
const returnSuccess = (msg, errorCode) => {
  throw new errors.Success(msg, errorCode);
};

const returnData = (ctx, data, msg = "") => {
  ctx.body = {
    code: 0,
    msg: msg,
    request: `${ctx.method} ${ctx.path}`,
    data: data,
  };
};

module.exports = {
  returnSuccess,
  returnData,
};
