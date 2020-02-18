
'use strict';

const Controller = require('egg').Controller;

class MainController extends Controller {

  async index() {
    // 首页的文章列表数据
    this.ctx.body = 'hi api';
  }

  async checkLogin() {
    const userName = this.ctx.request.body.userName;
    const password = this.ctx.request.body.password;
    console.log(userName, password);
    const sql = " SELECT userName FROM admin_user WHERE userName = '" + userName +
                  "' AND password = '" + password + "'";

    const res = await this.app.mysql.query(sql);
    if (res.length > 0) {
      // 登录成功,进行session缓存
      const openId = new Date().getTime();
      this.ctx.session.openId = { openId };
      this.ctx.body = { code: 0, data: '登录成功', openId };
    } else {
      this.ctx.body = { code: 1, data: '登录失败' };
    }
  }

  // 后台文章分类信息
  async getTypeInfo() {
    const resType = await this.app.mysql.select('type');
    this.ctx.body = { code: 0, data: resType };
  }

  // 添加文章
  async addArticle() {
    const tmpArticle = this.ctx.request.body;
    // tmpArticle.
    const result = await this.app.mysql.insert('article', tmpArticle);
    const insertSuccess = result.affectedRows === 1;
    const insertId = result.insertId;

    this.ctx.body = {
      code: 0,
      data: {
        isScuccess: insertSuccess,
        insertId,
      },
    };
  }

  // 修改文章
  async updateArticle() {
    const tmpArticle = this.ctx.request.body;
    // console.log(tmpArticle.row, 223);
    // const options = {
    //   where: {
    //     id: tmpArticle.id,
    //   },
    // };
    console.log(tmpArticle);
    const result = await this.app.mysql.update('article', tmpArticle);
    const updateSuccess = result.affectedRows === 1;
    console.log(updateSuccess);
    this.ctx.body = {
      code: 0,
      data: {
        isScuccess: updateSuccess,
      },
    };
  }

  // 获得文章列表
  async getArticleList() {

    const sql = 'SELECT article.id as id,' +
                'article.title as title,' +
                'article.introduce as introduce,' +
                'article.view_count as view_count,' +
                "FROM_UNIXTIME(article.addTime,'%Y-%m-%d' ) as addTime," +
                'type.typeName as typeName ' +
                'FROM article LEFT JOIN type ON article.type_id = type.Id ' +
                'ORDER BY article.id DESC ';

    const resList = await this.app.mysql.query(sql);
    this.ctx.body = {
      code: 0,
      list: resList,
    };

  }
}

module.exports = MainController;
