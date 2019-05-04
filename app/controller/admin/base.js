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

  async delete() {
    // 获取模型
    const model = this.ctx.request.query.model;
    // 获取ID
    const _id = this.ctx.request.query._id;
    // 删除数据
    await this.ctx.model[model].deleteOne({ _id });
    // 跳转到执行删除的页面
    this.ctx.redirect(this.ctx.state.prevPage);
  }

  async changeStatus() {
    const model = this.ctx.request.query.model;
    const attr = this.ctx.request.query.attr;
    const _id = this.ctx.request.query._id;
    const result = await this.ctx.model[model].find({ _id });
    if (result.length > 0) {
      let json = {
        [attr]: 1,
      };
      if (result[0][attr] === 1) {
        json = {
          [attr]: 0,
        };
      }
      const updateResult = await this.ctx.model[model].updateOne({ _id }, json);
      if (updateResult) {
        this.ctx.body = { msg: '更新成功', success: 'true' };
      } else {
        this.ctx.body = { msg: '更新失败', success: 'false' };
      }
    } else {
      this.ctx.body = '参数错误！';
    }
  }
}

module.exports = BaseController;
