/*
 * @Author: Brightness
 * @Date: 2021-04-20 08:36:58
 * @LastEditors: Brightness
 * @LastEditTime: 2021-04-20 11:40:01
 * @Description:文件静态缓存
 */
const fs = require("fs");
const path = require("path");
const { logger } = require("../logger");
class FileCache {
  constructor(expires, dir) {
    this.saveDir = dir || path.join(process.cwd(), global.config.fileCache.dir);
    this.expiresTime = parseInt(expires) || 0;
    this._initDir();
    this.ext = ".txt";
  }

  /**
   * 设置
   * @param string key
   * @param {*} data
   * @returns
   */
  set(key, data) {
    if (typeof key != "string") {
      return;
    }
    let dataString = this._encode(data);

    fs.writeFile(path.join(this.saveDir, key + this.ext), dataString, (err) => {
      if (err) {
        logger.error(err.message);
      }
    });
  }

  /**
   * 读取，过期返回false
   * @param string key
   */
  get(key) {
    if (typeof key != "string") {
      return;
    }
    let file = path.join(this.saveDir, key + this.ext);

    //不存在，返回false
    let bool = fs.existsSync(file);
    if (!bool) return false;

    let data = fs.readFileSync(file);
    data = data.toString();
    let decode_data = this._decode(data);
    let now = new Date().getTime();
    //缓存过期,返回false
    if (decode_data.time < now) {
      return false;
    }

    return decode_data.data;
  }

  /**
   * 删除
   *
   * @param string key
   * @return {*}
   * @memberof FileCache
   */
  delete(key) {
    if (typeof key != "string") {
      return false;
    }
    return fs.unlinkSync(path.join(this.saveDir, key + ".txt"));
  }

  /**
   * 正整数前补零
   *
   * @param {*} num
   * @return {*}
   * @memberof FileCache
   */
  _fillZero(num) {
    return (Array(11).join(0) + num).slice(-11);
  }

  /**
   * 格式化数据
   * @param {*} data
   * @returns
   */
  _encode(data) {
    let time = new Date().getTime() + this.expiresTime * 1000;
    return (
      time +
      JSON.stringify({
        data: data,
      })
    );
  }

  /**
   * 解析数据
   * @param string dataStr
   */
  _decode(dataStr) {
    return {
      time: parseInt(dataStr.slice(0, 13)),
      data: JSON.parse(dataStr.slice(13)).data,
    };
  }

  /**
   * 判断文件夹是否存在，不存在则创建
   */
  async _initDir() {
    try {
      await fs.promises.stat(this.saveDir);
    } catch (e) {
      // 不存在文件夹，直接创建 {recursive: true} 这个配置项是配置自动创建多个文件夹
      await fs.promises.mkdir(this.saveDir, { recursive: true });
    }
  }
}

module.exports = { FileCache };
