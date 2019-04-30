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
      const hasAccess = await ctx.service.admin.checkAuth(ctx.session.userinfo.role_id);
      if (hasAccess) {
        // 获取权限列表
        ctx.state.accessList = await ctx.service.admin.getAccessList(ctx.session.userinfo.role_id);
        await next();
      } else {
        ctx.body = '无访问权限！';
      }
    } else {
      if (pathname === '/admin/login' || pathname === '/admin/verify' || pathname === '/admin/doLogin') {
        await next();
      } else {
        ctx.redirect('/admin/login');
      }
    }
  };
};
