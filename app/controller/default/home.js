'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async getArticleList() {
    // sql 查询语句
    const sql = 'SELECT article.id as id,' +
                'article.title as title,' +
                'article.introduce as introduce,' +
                'FROM_UNIXTIME(article.addTime, "%Y-%m-%d %H:%i:%s" ) as addTime,' + // 将时间戳转为日期格式
                'article.view_count as view_count ,' +
                '.type.typeName as typeName ' +
                'FROM article LEFT JOIN type ON article.type_id = type.Id';

    const results = await this.app.mysql.query(sql); // {data, url}

    this.ctx.body = {
      data: results,
    };
  }
}

module.exports = HomeController;
