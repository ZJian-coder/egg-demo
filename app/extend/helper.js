'use strict';

const sd = require('silly-datetime');

module.exports = {
  // this 是 helper 对象，在其中可以调用其他 helper 方法
  // this.ctx => context 对象
  // this.app => application 对象
  formatDate(date, format) {
    return sd.format(date, format);
  },
};
