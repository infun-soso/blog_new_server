'use strict';

module.exports = () => {
  return async function adminauth(ctx, next) {
    console.log(ctx.session.openId, 11111);
    if (ctx.session.openId) {
      await next();
    } else {
      ctx.body = { code: 1, data: '没有登录' };
    }
  };
};
