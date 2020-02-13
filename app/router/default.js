'use strict';

/**
 * @param {Egg.Application} app - egg application
 * @author infun
 */
module.exports = app => {
  const { router, controller } = app;
  // 客户端api路由
  router.get('/default/getArticleList', controller.default.home.getArticleList);
  router.get('/default/getTypeInfo', controller.default.home.getTypeInfo);
  router.get('/default/getArticleById/:id', controller.default.home.getArticleById);
  router.get('/default/getListById/:id', controller.default.home.getListById);
};
