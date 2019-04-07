'use strict';

const Service = require('egg').Service;

const svgCaptcha = require('svg-captcha');

class ToolsService extends Service {
  async verify() {
    const captcha = svgCaptcha.create({
      size: 6,
      ignoreChars: '0o1i',
      noise: 1, // 干扰线条的数量
      background: '#cc9966',
    });
    this.ctx.session.code = captcha.text;
    return captcha;
  }
}

module.exports = ToolsService;
