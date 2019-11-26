"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ret_component_1 = require("./ret.component");
class DBTools {
    execSQLCallback(options) {
        let ret = new ret_component_1.RetObject;
        if (options.err) {
            console.log(`${options.fileName}/${options.funcName} callback err >>>> `);
            console.log(options.err);
            ret.code = 2;
            ret.description = `数据库执行错误：${options.err}`;
        }
        else if (options.raw) {
            console.log(`${options.fileName}/${options.funcName} callback raw >>>`);
            console.log(options.raw);
            if (options.method === 'update') {
                if (options.raw.n === 0) {
                    ret.code = 1;
                    ret.description = `更新失败，未匹配到特定数据`;
                }
                else if (options.raw.nModified === 0) {
                    ret.code = 1;
                    ret.description = `更新失败，影响0行数据`;
                }
                else {
                    ret.code = 0;
                }
            }
            else if (options.method === 'find') {
                ret.code = 0;
                ret.result = options.raw;
            }
            else if (options.method === 'create') {
                ret.code = 0;
            }
        }
        else {
            ret.code = 1;
            ret.description = `执行结果无效`;
        }
        return ret;
    }
    getUpdateCode(result) {
        let code = 2;
        if (result.ok) {
            if (result.n) {
                if (result.nModified) {
                    code = 0;
                }
                else {
                    code = 1;
                }
            }
            else {
                code = 1;
            }
        }
        else {
            code = 2;
        }
        return code;
    }
}
exports.dbTools = new DBTools();
//# sourceMappingURL=db.tools.js.map