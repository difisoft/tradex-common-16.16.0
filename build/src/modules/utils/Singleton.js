"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.singleton = exports.Singleton = void 0;
class Singleton {
    constructor() {
        this.map = new Map();
    }
    add(instanceType, instance) {
        this.map[instanceType] = instance;
    }
    retrieve(instanceType) {
        return this.map[instanceType];
    }
}
exports.Singleton = Singleton;
const singleton = new Singleton();
exports.singleton = singleton;
//# sourceMappingURL=Singleton.js.map