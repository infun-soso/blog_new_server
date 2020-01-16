'use strict';

/**
 * @param {Egg.Application} app - egg application
 * @author infun
 */
module.exports = app => {
  const { router, controller } = app;
  // 客户端api路由
  router.get('/default/getArticleList', controller.default.home.getArticleList);
};