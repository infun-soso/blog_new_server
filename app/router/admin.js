'use strict';

module.exports = app => {
  const { router, controller } = app;
  const adminauth = app.middleware.adminauth();
  router.post('/admin/checkOpenId', controller.admin.main.checkLogin);
  router.post('/admin/signUp', controller.admin.main.signUp);
  router.get('/admin/getTypeInfo', adminauth, controller.admin.main.getTypeInfo);
  router.post('/admin/addArticle', adminauth, controller.admin.main.addArticle);
  router.post('/admin/updateArticle', adminauth, controller.admin.main.updateArticle);
  router.get('/admin/getArticleList', adminauth, controller.admin.main.getArticleList);
  router.get('/admin/delArticle/:id', adminauth, controller.admin.main.delArticle);
  router.get('/admin/getArticleById/:id', adminauth, controller.admin.main.getArticleById);
  router.get('/admin/getUserList', adminauth, controller.admin.main.getUserList);
  router.get('/admin/getUploadToken', adminauth, controller.admin.main.getUploadToken);
};
