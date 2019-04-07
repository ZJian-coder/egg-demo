'use strict';

const Controller = require('egg').Controller;

class BaseController extends Controller {
  async success(redirectUrl) {
    await this.ctx.render('/admin/public/success', {
      redirectUrl,
    });
  }

  async error(redirectUrl) {
    await this.ctx.render('/admin/public/error', {
      redirectUrl,
    });
  }

  async verify() {
    const captcha = await this.ctx.service.tools.verify();
    this.ctx.type = 'image/svg+xml'; // 指定返回的类型
    this.ctx.body = captcha.data;
  }
}

module.exports = BaseController;
