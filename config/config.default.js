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
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1574974882358_4568';

  // add your middleware config here
  config.middleware = [];

  // mysql
  config.mysql = {
    // database configuration
    client: {
      // host
      host: 'localhost',
      // port
      port: '3306',
      // username
      user: 'root',
      // password
      password: 'wyh85375352',
      // database
      database: 'nextdoor',    
    },
    // load into app, default is open
    app: true,
    // load into agent, default is close
    agent: false,
  };

  // for dev
  config.security = {
    csrf: {
      enable: false,
    }
  };

  // view
  config.view = {
    mapping: {
      '.ejs': 'ejs',
      '.html': 'ejs'
    }
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
