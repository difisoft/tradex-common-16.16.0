"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rightPad = exports.leftPad = exports.isEmpty = void 0;
exports.isEmpty = (input) => {
    return (input == null || input === "" || input.length <= 0);
};
exports.leftPad = (str, size, padString) => {
    if (str == null) {
        return null;
    }
    const pads = size - str.length;
    if (pads <= 0) {
        return str;
    }
    const fillData = padString.repeat(pads);
    return `${fillData.slice(0, pads)}${str}`;
};
exports.rightPad = (str, size, padString) => {
    if (str == null) {
        return null;
    }
    const pads = size - str.length;
    if (pads <= 0) {
        return str;
    }
    const fillData = padString.repeat(pads);
    return `${str}${fillData.slice(0, pads)}`;
};
//# sourceMappingURL=StringUtils.js.map