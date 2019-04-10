'use strict';

const Controller = require('egg').Controller;

class BaseController extends Controller {
  async success(redirectUrl, message) {
    await this.ctx.render('/admin/public/success', {
      redirectUrl,
      message: message || '操作成功！',
    });
  }

  async error(redirectUrl, message) {
    await this.ctx.render('/admin/public/error', {
      redirectUrl,
      message: message || '操作失败！',
    });
  }

  async verify() {
    const captcha = await this.ctx.service.tools.verify();
    this.ctx.type = 'image/svg+xml'; // 指定返回的类型
    this.ctx.body = captcha.data;
  }
}

module.exports = BaseController;
