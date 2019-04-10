'use strict';

const BaseController = require('./base.js');

class LoginController extends BaseController {
  async index() {
    await this.ctx.render('/admin/login');
  }

  async doLogin() {
    const loginInfo = this.ctx.request.body;
    const verify = loginInfo.verify.toUpperCase();
    if (verify === this.ctx.session.code) {
      const username = loginInfo.username;
      const password = await this.ctx.service.tools.md5(loginInfo.password);
      const result = await this.ctx.model.Admin.find({ username, password });
      if (result.length > 0) {
        this.ctx.session.userinfo = result[0];
        this.ctx.redirect('/admin/manager');
      } else {
        await this.error('/admin/login/', '用户不存在或密码错误！');
      }
    } else {
      await this.error('/admin/login/', '验证码错误！');
    }
  }

  async loginOut() {
    this.ctx.session.userinfo = null;
    this.ctx.redirect('/admin/login');
  }
}

module.exports = LoginController;
