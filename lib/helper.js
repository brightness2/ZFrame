/*
 * @Author: Brightness
 * @Date: 2021-04-13 17:42:32
 * @LastEditors: Brightness
 * @LastEditTime: 2021-04-19 16:10:31
 * @Description:帮助函数
 */
const returnSuccess = (msg, errorCode) => {
  throw new errors.Success(msg, errorCode);
};

const returnData = (ctx, data, msg = "") => {
  let obj = {
    code: 0,
    msg: msg,
    request: `${ctx.method} ${ctx.path}`,
    data: data,
  };
  //存在新token则赋值输出
  if (ctx.newToken) {
    obj.newToken = ctx.newToken;
    ctx.newToken = "";
  }
  ctx.body = obj;
};

module.exports = {
  returnSuccess,
  returnData,
};
