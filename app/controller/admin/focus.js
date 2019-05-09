'use strict';

const Controller = require('egg').Controller;

const fs = require('fs');
const path = require('path');

class FocusController extends Controller {
  async index() {
    await this.ctx.render('/admin/focus/index');
  }

  async multi() {
    await this.ctx.render('/admin/focus/multi');
  }

  async doSingleUpload() {
    const file = this.ctx.request.files[0];
    const name = 'app/public/upload/' + path.basename(file.filename);
    try {
      // 处理文件
      fs.writeFileSync(name, file.filepath);
    } finally {
      // 需要删除临时文件
      await fs.unlink(file.filepath);
    }

    this.ctx.body = {
      url: name,
      // 获取所有的字段值
      requestBody: this.ctx.request.body,
    };
  }

  async doMultiUpload() {
    for (const file of this.ctx.request.files) {
      try {
        // 处理文件
        const name = 'app/public/upload/' + path.basename(file.filename);
        fs.writeFileSync(name, file.filepath);
      } finally {
        // 需要删除临时文件
        await fs.unlink(file.filepath);
      }
    }
    this.ctx.body = {
      // 获取所有的字段值
      requestBody: this.ctx.request.body,
    };
  }
}

module.exports = FocusController;
