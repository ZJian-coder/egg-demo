'use strict';

const Service = require('egg').Service;
const svgCaptcha = require('svg-captcha');
const md5 = require('md5');
const sd = require('silly-datetime');
const path = require('path');
const mkdirp = require('mz-modules/mkdirp');
const jimp = require('jimp');

class ToolsService extends Service {
  // 生成验证码
  async verify() {
    const captcha = svgCaptcha.create({
      size: 4,
      ignoreChars: '0o1i',
      noise: 1, // 干扰线条的数量
      background: '#cc9966',
    });
    this.ctx.session.code = captcha.text.toUpperCase();
    return captcha;
  }

  // md5加密
  async md5(str) {
    return md5(str);
  }

  // 获取时间
  async getTime() {
    const d = new Date();
    return d.getTime();
  }

  // 文件上传
  async getUploadFile(filepath) {
    // 1、获取当前日期     20180920
    const day = sd.format(new Date(), 'YYYYMMDD');

    // 2、创建图片保存的路径
    const dir = path.join(this.config.uploadPath, day);
    await mkdirp(dir);
    const d = await this.getTime(); /* 毫秒数*/

    // 返回图片保存的路径
    const uploadDir = path.join(dir, d + path.extname(filepath));

    // app\public\admin\upload\20180914\1536895331444.png
    return {
      uploadDir,
      saveDir: uploadDir.slice(3).replace(/\\/g, '/'),
    };
  }

  // 生成缩略图
  async jimpImg(imgPath) {
    jimp.read(imgPath, (err, lenna) => {
      if (err) throw err;
      lenna
        .resize(150, jimp.AUTO) // resize
        .quality(70) // set JPEG quality
        .write(imgPath + path.extname(imgPath)); // save
    });
  }
}

module.exports = ToolsService;
