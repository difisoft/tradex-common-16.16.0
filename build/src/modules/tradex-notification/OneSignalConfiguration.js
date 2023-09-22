"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DelayedOption = exports.IosBadgeType = exports.AndroidVisibility = void 0;
const MethodEnum_1 = require("./MethodEnum");
var AndroidVisibility;
(function (AndroidVisibility) {
    AndroidVisibility[AndroidVisibility["PRIVATE"] = 0] = "PRIVATE";
    AndroidVisibility[AndroidVisibility["DEFAULT"] = 1] = "DEFAULT";
    AndroidVisibility[AndroidVisibility["SECRET"] = -1] = "SECRET";
})(AndroidVisibility = exports.AndroidVisibility || (exports.AndroidVisibility = {}));
var IosBadgeType;
(function (IosBadgeType) {
    IosBadgeType["NONE"] = "None";
    IosBadgeType["SET_TO"] = "SetTo";
    IosBadgeType["INCREASE"] = "Increase";
})(IosBadgeType = exports.IosBadgeType || (exports.IosBadgeType = {}));
var DelayedOption;
(function (DelayedOption) {
    DelayedOption["TIMEZONE"] = "timezone";
    DelayedOption["LAST_ACTIVE"] = "last-active";
})(DelayedOption = exports.DelayedOption || (exports.DelayedOption = {}));
class OneSignalConfiguration {
    constructor() {
        this.contents = new Map();
        this.headings = new Map();
        this.subtitle = new Map();
        this.data = new Map();
        this.ios_attachments = new Map();
        this.android_group_message = new Map();
        this.adm_group_message = new Map();
    }
    getMethod() {
        return MethodEnum_1.default.ONESIGNAL;
    }
}
exports.default = OneSignalConfiguration;
//# sourceMappingURL=OneSignalConfiguration.js.map