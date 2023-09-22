"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMsTime = exports.diffMsTime = void 0;
function diffMsTime(time) {
    const currentTime = process.hrtime();
    return currentTime[0] * 1000 + currentTime[1] / 1000000 - time;
}
exports.diffMsTime = diffMsTime;
function getMsTime(hrTime = null) {
    const currentTime = hrTime == null ? process.hrtime() : hrTime;
    return currentTime[0] * 1000 + currentTime[1] / 1000000;
}
exports.getMsTime = getMsTime;
//# sourceMappingURL=mstime.js.map