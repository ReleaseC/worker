const winston = require('winston');

/**
 * 日志系统
 * @description Winston Logger
 */
class Logger {
  logger: any;
  
  /**
   * 控制台输出格式
   */
  consoleFormat: Object = {
    timestamp: function () {
      return new Date().toLocaleString();
    },
    formatter: function (options) {
      return `${options.timestamp()} / 
      ${winston.config.colorize(
        options.level, options.level.toUpperCase()
      )} / 
      ${options.message || ""} /
      ${options.meta && Object.keys(options.meta).length ? JSON.stringify(options.meta) : ''}
      `;
    }
  };

  /**
   * 输出到文件的格式
   */
  fileFormat: Object = {
    filename: `server.log`,
    timestamp: function () {
      return new Date().toLocaleString();
    }
  };

  logIOSetting: Object = {
    port: 28777,
    node_name: 'server',
    host: '106.75.224.77'
  };

  constructor() {
    this.logger = new (winston.Logger)({
      transports: [
        new (winston.transports.Console)(this.consoleFormat),
        new (winston.transports.File)(this.fileFormat),
        // new (winston.transports.Logio)(this.logIOSetting)
      ],
      exitOnError: function (err) {
        //  当发生错误时 发生的回调
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> logger.ts")
        console.log(`in exitOnError() = `);
        console.log(err);
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>> end of logger.ts");
        return err.code !== 'EPIPE';
      }
    });
  }
}

export default new Logger().logger;

