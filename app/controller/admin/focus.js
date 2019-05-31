'use strict';

const BaseController = require('./base.js');

const fs = require('mz/fs');
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
      fs.createReadStream(file.filepath).pipe(fs.createWriteStream(name));
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
        fs.createReadStream(file.filepath).pipe(fs.createWriteStream(name));
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
    const focusInfo = await this.ctx.model.Focus.find({});
    await this.ctx.render('/admin/focus/index', {
      focusInfo,
    });
  }

  async add() {
    await this.ctx.render('/admin/focus/add');
  }

  async doAdd() {
    const file = this.ctx.request.files[0];
    const fileInfo = await this.service.tools.getUploadFile(file.filepath);
    try {
      // 处理文件
      fs.createReadStream(file.filepath).pipe(fs.createWriteStream(fileInfo.uploadDir));
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

  async edit() {
    const _id = this.ctx.request.query._id;
    const focusInfo = await this.ctx.model.Focus.findById(_id);
    await this.ctx.render('/admin/focus/edit', {
      focusInfo,
    });
  }

  async doEdit() {
    const file = this.ctx.request.files[0];
    const fileField = this.ctx.request.body;
    if (file) {
      const fileInfo = await this.service.tools.getUploadFile(file.filepath);
      try {
        // 处理文件
        fs.createReadStream(file.filepath).pipe(fs.createWriteStream(fileInfo.uploadDir));
        fileField.focus_img = fileInfo.saveDir;
      } finally {
        // 需要删除临时文件
        await fs.unlink(file.filepath);
      }
    }
    const result = await this.ctx.model.Focus.updateOne({
      _id: fileField._id,
    }, fileField);
    console.log(result);
    await this.success('/admin/focus', '编辑轮播图成功');
  }
}

module.exports = FocusController;
