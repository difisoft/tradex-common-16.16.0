"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rx_1 = require("rx");
const rx_2 = require("./rx");
class State {
    constructor(fields, completedStateValue, getDefaultValue) {
        this.fields = fields;
        this.completedStateValue = completedStateValue;
        this.getDefaultValue = getDefaultValue;
        this.stateData = new Map();
        this.completed = null;
        fields.forEach((field) => {
            this.stateData.set(field, getDefaultValue());
        });
    }
    addField(fields) {
        this.fields.push(...fields);
        fields.forEach((field) => {
            this.stateData.set(field, this.getDefaultValue());
        });
    }
    subscribeCompleted() {
        if (this.completed == null) {
            this.completed = new rx_1.Subject();
            this.checkCompleted();
        }
        return this.completed;
    }
    setState(field, value) {
        this.stateData.set(field, value);
        if (this.completed != null) {
            if (value === this.completedStateValue) {
                this.checkCompleted();
            }
            else {
                rx_2.onError(this.completed, false);
            }
        }
    }
    checkCompleted() {
        for (let i = 0; i < this.fields.length; i++) {
            if (this.stateData.get(this.fields[i]) !== this.completedStateValue) {
                return;
            }
        }
        rx_2.onNext(this.completed, true);
    }
}
exports.default = State;
//# sourceMappingURL=State.js.map