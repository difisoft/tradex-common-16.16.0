/// <reference types="rx-core" />
/// <reference types="rx-core-binding" />
/// <reference types="rx-lite" />
/// <reference types="rx-lite-aggregates" />
/// <reference types="rx-lite-backpressure" />
/// <reference types="rx-lite-coincidence" />
/// <reference types="rx-lite-experimental" />
/// <reference types="rx-lite-joinpatterns" />
/// <reference types="rx-lite-time" />
import { Observable } from 'rx';
export default class State<T> {
    fields: string[];
    completedStateValue: T;
    private getDefaultValue;
    private stateData;
    private completed;
    constructor(fields: string[], completedStateValue: T, getDefaultValue: () => T);
    addField(fields: string[]): void;
    subscribeCompleted(): Observable<boolean>;
    setState(field: string, value: T): void;
    private checkCompleted;
}
