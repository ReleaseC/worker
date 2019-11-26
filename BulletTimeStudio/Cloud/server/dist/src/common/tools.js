"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Tools {
    isEmptyArray(array) {
        return array.length === 0;
    }
    isValidArray(array) {
        return this.isEmptyArray(array) ? false : array;
    }
}
const tools = new Tools();
exports.default = tools;
//# sourceMappingURL=tools.js.map