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
  };

  return {
    ...config,
    ...userConfig,
  };
};
