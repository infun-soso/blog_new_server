
'use strict';
const ms = require('ms');
const qiniu = require('qiniu');

const Controller = require('egg').Controller;

class MainController extends Controller {

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
      this.ctx.session.maxAge = ms('2h');
      this.ctx.body = { code: 0, data: '登录成功', openId };
    } else {
      this.ctx.body = { code: 1, data: '登录失败' };
    }
  }

  async signUp() {
    const userName = this.ctx.request.body.userName;
    const password = this.ctx.request.body.password;
    const existence_sql = " SELECT userName FROM admin_user WHERE userName = '" + userName + "'";
    const existence = await this.app.mysql.query(existence_sql);

    if (existence.length > 0) {
      this.ctx.body = { code: 1, data: '此账号已被注册' };
      return;
    }

    const result = await this.app.mysql.insert('admin_user', {
      userName,
      password,
      addTime: Date.now() / 1000,
    });

    const insertSuccess = result.affectedRows === 1;
    // const insertId = result.insertId;
    if (insertSuccess) {
      this.ctx.body = { code: 0, data: '注册成功' };
    } else {
      this.ctx.body = { code: 1, data: '注册失败' };
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
                'article.likes as likes,' +
                'article.cover_url as cover_url,' +
                "FROM_UNIXTIME(article.addTime,'%Y-%m-%d %H:%i:%s' ) as addTime," +
                'type.typeName as typeName ' +
                'FROM article LEFT JOIN type ON article.type_id = type.Id ' +
                'ORDER BY article.id DESC ';

    const resList = await this.app.mysql.query(sql);
    this.ctx.body = {
      code: 0,
      list: resList,
    };

  }

  // 获得用户列表
  async getUserList() {
    const sql = 'SELECT id,' +
                'userName,' +
                "FROM_UNIXTIME(addTime,'%Y-%m-%d' ) as addTime FROM admin_user";

    const resList = await this.app.mysql.query(sql);
    this.ctx.body = {
      code: 0,
      list: resList,
    };

  }

  // 删除文章
  async delArticle() {
    const id = this.ctx.params.id;
    const res = await this.app.mysql.delete('article', { id });
    this.ctx.body = {
      code: 0,
      data: res,
    };
  }

  // 根据文章ID得到文章详情，用于修改文章
  async getArticleById() {
    const id = this.ctx.params.id;
    console.log(id);
    const sql = 'SELECT article.id as id,' +
                'article.title as title,' +
                'article.introduce as introduce,' +
                'article.article_content as article_content,' +
                'article.addTime * 1000 as addTime,' +
                'article.view_count as view_count ,' +
                'type.typeName as typeName ,' +
                'type.id as typeId ' +
                'FROM article LEFT JOIN type ON article.type_id = type.Id ' +
                'WHERE article.id=' + id;
    const result = await this.app.mysql.query(sql);
    this.ctx.body = {
      code: 0,
      data: result,
    };
  }

  async getUploadToken() {
    const bucket = 'blog';
    const accessKey = '8Z3BdkVh2RyRuzsqVhAKK7Njo_6oUzlpSUt2M9Hf';
    const secretKey = 'HNCkhVc169GbiZ_Fp-F-4YYjx5Pdb4bXDx-hws-v';

    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    const policyParams = { scope: bucket };
    const putPolicy = new qiniu.rs.PutPolicy(policyParams);
    const uploadToken = putPolicy.uploadToken(mac);
    this.ctx.body = {
      code: 0,
      data: {
        token: uploadToken,
      },
    };
  }
}

module.exports = MainController;
