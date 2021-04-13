/*
 * @Author: Brightness
 * @Date: 2021-04-13 10:07:05
 * @LastEditors: Brightness
 * @LastEditTime: 2021-04-13 10:12:48
 * @Description: 工具集
 */
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

module.exports = {
  findAttr,
};
