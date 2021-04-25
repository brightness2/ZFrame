/*
 * @Author: Brightness
 * @Date: 2021-04-13 10:33:51
 * @LastEditors: Brightness
 * @LastEditTime: 2021-04-13 12:37:34
 * @Description:
 */

const { ParameterException } = require("../../core/HttpExceptions");
const { ZValidator, Rule } = require("../../core/ZValidator");

// 校验参数是否为正整数
class TestValidator extends ZValidator {
  constructor() {
    super();
    this.ids = [
      new Rule("isOptional"), //设置可选，参数可以为null

      // 这里可以添加多个校验规则，但是规则是且的关系
      // 三个参数：第一个参数：需要满足的规则，第二个参数：提示信息，第三个参数：可选参数
      new Rule("isInt", "参数必须为正整数", { min: 1 }),
      // new Rule ('isNotEmpty', '必须传入参数')

      //添加正则
      new Rule("matches", "不符合[1-9]", "^[1-9]"),
    ];
  }

  /**自定义校验方法 定义即可，会自动调用*/
  validatePassowrd(vals) {
    let ids = vals.body.ids; //原始参数
    if (ids.length < 3) {
      throw new ParameterException("密码不符合规则");
    }
  }
}

module.exports = TestValidator;
