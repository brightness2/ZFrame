/*
 * @Author: Brightness
 * @Date: 2021-04-23 08:47:49
 * @LastEditors: Brightness
 * @LastEditTime: 2021-04-23 11:16:24
 * @Description:文件上传类
 */
const fs = require("fs");
const path = require("path");
const { checkDirExist } = require("../core/util");
class FileHelper {
  constructor() {}
  /**
   *复制文件
   *
   * @static
   * @param {*} source
   * @param {*} dest
   * @return {*}
   * @memberof FileHelper
   */
  static copy(source, dest) {
    if (!fs.existsSync(source)) {
      return false;
    }
    if (!fs.existsSync(dest)) {
      checkDirExist(path.dirname(dest));
      fs.writeFileSync(dest, "");
    }
    let readStream = fs.createReadStream(source);
    let writeStream = fs.createWriteStream(dest);
    return readStream.pipe(writeStream);
  }

  /**
   *移动文件
   *
   * @static
   * @param {*} source
   * @param {*} dest
   * @memberof FileHelper
   */
  static move(source, dest) {
    if (!fs.existsSync(source)) {
      return false;
    }
    if (!fs.existsSync(dest)) {
      checkDirExist(path.dirname(dest));
      fs.writeFileSync(dest, "");
    }
    fs.rename(source, dest, function (err) {
      if (err) throw err;
      fs.stat(dest, function (err, stats) {
        if (err) throw err;
        // console.log('stats: ' + JSON.stringify(stats));
      });
    });
    return true;
  }
}

module.exports = { FileHelper };
