'use strict';

const Service = require('egg').Service;

const svgCaptcha = require('svg-captcha');

const md5 = require('md5');

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
}

module.exports = ToolsService;
