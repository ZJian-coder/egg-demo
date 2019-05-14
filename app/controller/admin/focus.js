'use strict';

const BaseController = require('./base.js');

const fs = require('fs');
const path = require('path');

class FocusController extends BaseController {
  async single() {
    await this.ctx.render('/admin/focus/single');
  }

  async multi() {
    await this.ctx.render('/admin/focus/multi');
  }

  async doSingleUpload() {
    const file = this.ctx.request.files[0];
    const name = this.config.uploadPath + path.basename(file.filename);
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
        const name = this.config.uploadPath + path.basename(file.filename);
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

  async index() {
    await this.ctx.render('/admin/focus/index');
  }

  async add() {
    await this.ctx.render('/admin/focus/add');
  }

  async doAdd() {
    const file = this.ctx.request.files[0];
    const fileInfo = await this.service.tools.getUploadFile(file.filepath);
    try {
      // 处理文件
      fs.writeFileSync(fileInfo.uploadDir, file.filepath);
    } finally {
      // 需要删除临时文件
      await fs.unlink(file.filepath);
    }

    const fileField = this.ctx.request.body;
    fileField.focus_img = fileInfo.saveDir;
    const saveFile = new this.ctx.model.Focus(fileField);
    await saveFile.save();
    await this.success('/admin/focus', '添加轮播图成功');
  }
}

module.exports = FocusController;
