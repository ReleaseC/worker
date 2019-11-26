"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston = require('winston');
class Logger {
    constructor() {
        this.consoleFormat = {
            timestamp: function () {
                return new Date().toLocaleString();
            },
            formatter: function (options) {
                return `${options.timestamp()} / 
      ${winston.config.colorize(options.level, options.level.toUpperCase())} / 
      ${options.message || ""} /
      ${options.meta && Object.keys(options.meta).length ? JSON.stringify(options.meta) : ''}
      `;
            }
        };
        this.fileFormat = {
            filename: `server.log`,
            timestamp: function () {
                return new Date().toLocaleString();
            }
        };
        this.logIOSetting = {
            port: 28777,
            node_name: 'server',
            host: '106.75.224.77'
        };
        this.logger = new (winston.Logger)({
            transports: [
                new (winston.transports.Console)(this.consoleFormat),
                new (winston.transports.File)(this.fileFormat),
            ],
            exitOnError: function (err) {
                console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> logger.ts");
                console.log(`in exitOnError() = `);
                console.log(err);
                console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>> end of logger.ts");
                return err.code !== 'EPIPE';
            }
        });
    }
}
exports.default = new Logger().logger;
//# sourceMappingURL=logger.js.map