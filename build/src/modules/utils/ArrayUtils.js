"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeDuplicateObj = void 0;
exports.removeDuplicateObj = (arr, fieldName) => {
    if (arr === null || arr === undefined || fieldName === null || fieldName === undefined) {
        return [];
    }
    return arr.map((value) => value[fieldName])
        .map((currentValue, currentIndex, currentArr) => {
        if (currentArr.indexOf(currentValue) === currentIndex) {
            return currentIndex;
        }
        else {
            return -1;
        }
    })
        .filter((value) => value !== -1).map((value) => arr[value]);
};
//# sourceMappingURL=ArrayUtils.js.map