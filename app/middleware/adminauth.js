'use strict';

const url = require('url');

// eslint-disable-next-line no-unused-vars
module.exports = options => {
  return async function adminauth(ctx, next) {
    const pathname = url.parse(ctx.request.url).pathname;
    ctx.state.csrf = ctx.csrf; // 设置全局变量
    ctx.state.prevPage = ctx.request.headers.referer;
    if (ctx.session.userinfo) {
      ctx.state.userinfo = ctx.session.userinfo;
      await next();
    } else {
      if (pathname === '/admin/login' || pathname === '/admin/verify' || pathname === '/admin/doLogin') {
        await next();
      } else {
        ctx.redirect('/admin/login');
      }
    }
  };
};
