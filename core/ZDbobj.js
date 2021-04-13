/*
 * @Author: Brightness
 * @Date: 2021-04-07 15:27:23
 * @LastEditors: Brightness
 * @LastEditTime: 2021-04-13 16:40:05
 * @Description:ZDbobj 类
 * 基于knex.js
 * 具体参考 https://github1s.com/brightness2/node_study/blob/master/Knex/lib/ZDbobj/demo.js
 */
//引入依赖
const knexConfig = require("../config/db");
const knex = require("knex")(knexConfig);

/**
 * 数据库操作
 *
 * @class ZDbobj
 */
class ZDbobj {
  /**公共属性 */
  table = ""; //表名称
  /**受保护属性 */
  _knex = knex; //knex obj
  _tableKey = null; //数据表主键promise
  _builder = null; //knex sql 构造器

  /**
   * Creates an instance of ZDbobj.
   * 构造方法，初始化
   * @param {*} tableName
   * @memberof ZDbobj
   */
  constructor(tableName, tablePrefix = null) {
    //判断是否有表前缀，拼接表前缀
    if (tablePrefix) {
      this.table = tablePrefix + tableName;
    } else if (knexConfig.tablePrefix) {
      this.table = knexConfig.tablePrefix + tableName;
    } else {
      this.table = tableName;
    }

    this._builder = this._knex(this.table);
    this._getTableKey(); //获取数据表主键promise
  }

  /**测试连接 */
  test() {
    let data = this._knex
      .raw("select 1+1 as result")
      .then((res) => {
        console.log("数据库连接成功");
      })
      .catch((err) => {
        console.error(err);
      });
  }

  /**
   * 插入一条数据
   *
   * @param {*} row
   * @return  Promise
   * @memberof ZDbobj
   */
  insert(row) {
    return new Promise((resolve, reject) => {
      this._knex(this.table)
        .insert(row)
        .then((res) => {
          resolve(res[0]); //返回
        })
        .catch((err) => {
          console.error(err);
          reject(err);
        });
    });
  }

  /**
   * 批量插入
   *
   * @param {*} rows
   * @return  Promise
   * @memberof ZDbobj
   */
  batchInsert(rows) {
    let that = this;
    return new Promise((resolve, reject) => {
      that._knex
        .transaction(function (trx) {
          that._knex
            .batchInsert(that.table, rows)
            .then((res) => {})
            .catch((err) => {
              console.error(err);
            });
        })
        .then((res) => {
          resolve("插入成功");
        })
        .catch((err) => {
          console.error(err);
          reject(err);
        });
    });
  }

  /**
   * 根据主键更新一条数据
   *
   * @param {*} keyParam 主键查询参数
   * @param {*} row
   * @memberof ZDbobj
   */
  async update(keyParam, row) {
    let keys = await this._parsetableKeyParams(keyParam);
    return new Promise((resolve, reject) => {
      this._knex(this.table)
        .where(keys)
        .update(row)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.error(err);
          reject(err);
        });
    });
  }

  /**
   * 根据条件修改数据
   *
   * @param {*} row
   * @return {*}
   * @memberof ZDbobj
   */
  updateByParams(row) {
    let builder = this._builder;
    this._builder = this._knex(this.table);
    return new Promise((resolve, reject) => {
      builder
        .update(row)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.error(err);
          reject(err);
        });
    });
  }

  /**
   * 根据主键删除一条数据
   *
   * @param {*} keyParam 主键查询参数
   * @return {*}
   * @memberof ZDbobj
   */
  async delete(keyParam) {
    let keys = await this._parsetableKeyParams(keyParam);
    return new Promise((resolve, reject) => {
      this._knex(this.table)
        .where(keys)
        .del()
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.error(err);
          reject(err);
        });
    });
  }

  /**
   * 根据条件删除数据
   *
   * @return {*}
   * @memberof ZDbobj
   */
  deleteByParams() {
    let builder = this._builder;
    this._builder = this._knex(this.table);
    return new Promise((resolve, reject) => {
      builder
        .del()
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.error(err);
          reject(err);
        });
    });
  }

  /**
   * 根据主键获取一条数据
   *
   * @param {*} keyParam
   * @param {string} [fields=["*"]]
   * @return {*}
   * @memberof ZDbobj
   */
  async get(keyParam, fields = ["*"]) {
    let keys = await this._parsetableKeyParams(keyParam);
    return new Promise((resolve, reject) => {
      this._knex
        .column(fields)
        .select()
        .from(this.table)
        .where(keys)
        .limit(1)
        .then((res) => {
          resolve(res[0]);
        })
        .catch((err) => {
          console.error(err);
          reject(err);
        });
    });
  }

  /**
   * 根据条件获取一条数据
   *
   * @param {string} [fields=["*"]]
   * @return {*}
   * @memberof ZDbobj
   */
  getByParams(fields = ["*"]) {
    let builder = this._builder;
    this._builder = this._knex(this.table); //恢复初始builder
    return new Promise((resolve, reject) => {
      builder
        .column(fields)
        .select()
        .from(this.table)
        .limit(1)
        .then((res) => {
          resolve(res[0]);
        })
        .catch((err) => {
          console.error(err);
          reject(err);
        });
    });
  }

  /**
   * 根据条件执行查询
   *
   * @param {string} [fields=["*"]]
   * @return {*}
   * @memberof ZDbobj
   */
  setQuery(fields = ["*"]) {
    let builder = this._builder;
    this._builder = this._knex(this.table);
    return new Promise((resolve, reject) => {
      builder
        .column(fields)
        .select()
        .from(this.table)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.error(err);
          reject(err);
        });
    });
  }

  /**
   * 统计
   *
   * @param {*} field 字段
   * @param {*} as 字段别名
   * @return {*}
   * @memberof ZDbobj
   */
  count(field, as) {
    let builder = this._builder;
    this._builder = this._knex(this.table); //恢复初始builder
    return new Promise((resolve, reject) => {
      builder
        .count(field, { as: as })
        .then((res) => {
          resolve(res[0]);
        })
        .catch((err) => {
          console.error(err);
          reject(err);
        });
    });
  }

  /**
   * 最小值
   *
   * @param {*} param
   * @return {*}
   * @memberof ZDbobj
   */
  min(param) {
    let builder = this._builder;
    this._builder = this._knex(this.table); //恢复初始builder
    return new Promise((resolve, reject) => {
      builder
        .min(param)
        .then((res) => {
          resolve(res[0]);
        })
        .catch((err) => {
          console.error(err);
          reject(err);
        });
    });
  }

  /**
   * 最大值
   *
   * @param {*} param
   * @return {*}
   * @memberof ZDbobj
   */
  max(param) {
    let builder = this._builder;
    this._builder = this._knex(this.table); //恢复初始builder
    return new Promise((resolve, reject) => {
      builder
        .max(param)
        .then((res) => {
          resolve(res[0]);
        })
        .catch((err) => {
          console.error(err);
          reject(err);
        });
    });
  }

  /**
   * 总和
   *
   * @param {*} param
   * @return {*}
   * @memberof ZDbobj
   */
  sum(param) {
    let builder = this._builder;
    this._builder = this._knex(this.table); //恢复初始builder
    return new Promise((resolve, reject) => {
      builder
        .sum(param)
        .then((res) => {
          resolve(res[0]);
        })
        .catch((err) => {
          console.error(err);
          reject(err);
        });
    });
  }

  /**
   * 平均值
   *
   * @param {*} param
   * @return {*}
   * @memberof ZDbobj
   */
  avg(param) {
    let builder = this._builder;
    this._builder = this._knex(this.table); //恢复初始builder
    return new Promise((resolve, reject) => {
      builder
        .avg(param)
        .then((res) => {
          resolve(res[0]);
        })
        .catch((err) => {
          console.error(err);
          reject(err);
        });
    });
  }

  /*********** 受保护方法 *************** */

  /**
   * 返回构造的sql语句
   *
   * @return {*}
   * @memberof ZDbobj
   */
  _toString() {
    let sql = this._builder.toString();
    console.log(sql);
    return sql;
  }

  /**
   * 获取数据表的主键
   * this._tableKey 赋值为 数据表主键promise
   * @memberof ZDbobj
   * @return void
   */
  _getTableKey() {
    return (this._tableKey = new Promise((resolve, reject) => {
      this._knex
        .raw("desc " + this.table)
        .then((res) => {
          let arr = [];
          for (let col of res[0]) {
            if (col.Key == "PRI") {
              let obj = {};
              obj[col.Field] = "";
              arr.push(col.Field);
            }
          }
          resolve(arr.sort());
        })
        .catch((err) => {
          reject(err);
        });
    }));
  }

  /**
   * 解析查询的主键参数
   *
   * @param {*} params string/object
   * @memberof ZDbobj
   */
  async _parsetableKeyParams(params) {
    let keys = await this._tableKey; //等待数据表主键promise返回,如：['id']

    if (keys.length <= 0) {
      console.error("数据表缺少主键");
      return null;
    }

    let obj = {};

    if (keys.length == 1) {
      if (typeof params != "object") {
        obj[keys[0]] = params;
      } else {
        obj[keys[0]] = params[keys[0]];
      }
    } else {
      for (let i of keys) {
        obj[i] = params[i];
      }
    }

    return obj;
  }

  /**
   * 排序 ， 分页 ， 分组
   *
   * @param {*} params object {order,limit,offset,group,having}
   * @memberof ZDbobj
   */
  _filterParams(params) {
    //排序
    if (params["order"] && Array.isArray(params["order"])) {
      this._builder.orderBy(params["order"]);
    }

    //分页
    if (params["limit"]) {
      this._builder.limit(params["limit"]);
      if (params["offset"] && params["offset"] > 0) {
        this._builder.offset(params["offset"]);
      }
    }

    //分组
    if (params["group"]) {
      this._builder.groupBy(params["group"]);
      if (params["having"] && Array.isArray(params["having"])) {
        this._builder.having(...params["having"]);
      }
    }
  }

  /**
   * 添加查询条件
   *
   * @param {*} field 字段
   * @param {*} operator 操作符
   * @param {*} value 值
   * @memberof ZDbobj
   */
  _where(field, operator, value) {
    this._builder.where(...arguments);
    return this;
  }

  /**
   * 添加查询条件
   *
   * @param {*} field 字段
   * @param {*} operator 操作符
   * @param {*} value 值
   * @memberof ZDbobj
   */
  _orWhere(field, operator, value) {
    this._builder.orWhere(...arguments);
    return this;
  }

  _whereLike(field, value) {
    this._builder.where(field, "like", "%" + value + "%");
    return this;
  }

  /**
   * 添加查询条件
   *
   * @param {*} field 字段
   * @param {*} operator 操作符
   * @param {*} value 值
   * @memberof ZDbobj
   */
  _whereNot(field, operator, value) {
    this._builder.whereNot(...arguments);
    return this;
  }

  /**
   * 添加查询条件
   *
   * @param {*} field 字段
   * @param {*} value 值
   * @memberof ZDbobj
   */
  _whereIn(field, value) {
    this._builder.whereIn(field, value);
    return this;
  }

  /**
   * 添加查询条件
   *
   * @param {*} field 字段
   * @param {*} value 值
   * @memberof ZDbobj
   */
  _orWhereIn(field, value) {
    this._builder.orWhereIn(field, value);
    return this;
  }

  /**
   * 添加查询条件
   *
   * @param {*} field 字段
   * @param {*} value 值
   * @memberof ZDbobj
   */
  _whereNotIn(field, value) {
    this._builder.whereNotIn(field, value);
    return this;
  }

  /**
   * 添加查询条件
   *
   * @param {*} field 字段
   * @param {*} value 值
   * @memberof ZDbobj
   */
  _orWhereNotIn(field, value) {
    this._builder.orWhereNotIn(field, value);
    return this;
  }

  /**
   * 添加查询条件
   *
   * @param {*} field 字段
   * @return {*}
   * @memberof ZDbobj
   */
  _whereNull(field) {
    this._builder.whereNull(field);
    return this;
  }

  /**
   * 添加查询条件
   *
   * @param {*} field 字段
   * @return {*}
   * @memberof ZDbobj
   */
  _whereNotNull(field) {
    this._builder.whereNotNull(field);
    return this;
  }

  /**
   * 添加查询条件
   *
   * @param {*} callBack
   * @return {*}
   * @memberof ZDbobj
   */
  _whereExists(callBack) {
    this._builder.whereExists(callBack);
    return this;
  }

  /**
   * 添加查询条件
   *
   * @param {*} callBack
   * @return {*}
   * @memberof ZDbobj
   */
  _whereNotExists(callBack) {
    this._builder.whereNotExists(callBack);
    return this;
  }

  /**
   * 内连
   *
   * @param {*} tableName 表名
   * @param {*} field 字段名1
   * @param {*} field2 字段名2
   * @return {*}
   * @memberof ZDbobj
   */
  _join(tableName, field, field2) {
    this._builder.join(tableName, field, field2);
    return this;
  }

  /**
   * 左连
   *
   * @param {*} tableName 表名
   * @param {*} field 字段名1
   * @param {*} field2 字段名2
   * @return {*}
   * @memberof ZDbobj
   */
  _leftJoin(tableName, field, field2) {
    this._builder.leftJoin(tableName, field, field2);
    return this;
  }

  /**
   * 右连
   *
   * @param {*} tableName 表名
   * @param {*} field 字段名1
   * @param {*} field2 字段名2
   * @return {*}
   * @memberof ZDbobj
   */
  _rightJoin(tableName, field, field2) {
    this._builder.rightJoin(tableName, field, field2);
    return this;
  }
}

module.exports = ZDbobj;
