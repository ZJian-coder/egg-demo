/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1554298073279_162';

  // add your middleware config here
  config.middleware = [ 'adminauth' ];
  config.adminauth = {
    match: '/admin',
  };

  // add your user config here
  const userConfig = {
    view: {
      mapping: {
        '.html': 'ejs',
      },
    },
    session: {
      key: 'SESSION_ZJNote',
      maxAge: 8640000,
      httpOnly: true,
      encrypt: true, // 加密
      renew: true, // 延长回话有效期
    },
    mongoose: {
      client: {
        url: 'mongodb://zjian:zjian2zjian@127.0.0.1:27017/ZJNote',
        options: {},
      },
    },
    redis: {
      client: {
        port: 6379, // Redis port
        host: '127.0.0.1', // Redis host
        password: '',
        db: 0,
      },
    },
    multipart: {
      mode: 'file', // 开启文件上传的file模式
      fields: '50', // 配置表单字段数量
    },
    security: {
      csrf: {
        // 判断是否需要 ignore 的方法，请求上下文 context 作为第一个参数
        ignore: ctx => {
          if (ctx.request.url === '/admin/goods/goodsUploadImage' || ctx.request.url === '/admin/goods/goodsUploadPhoto') {
            return true;
          }
          return false;
        },
      },
    },
    uploadPath: 'app/public/admin/upload/',
  };

  return {
    ...config,
    ...userConfig,
  };
};
