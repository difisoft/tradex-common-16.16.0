"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roundInt = exports.round = void 0;
const log_1 = require("../../modules/log");
exports.round = (input, scale = 2) => {
    if (input == null) {
        return input;
    }
    else {
        try {
            return Number(input.toFixed(scale));
        }
        catch (e) {
            log_1.logger.error(`Error while round data: ${input}`);
            return 0;
        }
    }
};
exports.roundInt = (input, scale = 1) => {
    if (input == null) {
        return input;
    }
    else {
        const roundNumber = Math.pow(10, scale);
        return Math.round(input / roundNumber) * roundNumber;
    }
};
//# sourceMappingURL=MathUtils.js.map