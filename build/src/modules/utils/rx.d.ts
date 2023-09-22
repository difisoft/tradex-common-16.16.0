/// <reference types="rx-core" />
/// <reference types="rx-lite" />
/// <reference types="rx-core-binding" />
/// <reference types="rx-lite-aggregates" />
/// <reference types="rx-lite-backpressure" />
/// <reference types="rx-lite-coincidence" />
/// <reference types="rx-lite-experimental" />
/// <reference types="rx-lite-joinpatterns" />
/// <reference types="rx-lite-time" />
import { Observable, Observer } from 'rx';
import Subject = Rx.Subject;
declare type ObserverSubject<T> = Observer<T> | Subject<T>;
declare type ObservableSubject<T> = Observable<T> | Subject<T>;
declare type TransformAsync<T, F> = (f: F, observer?: ObserverSubject<T>) => void;
declare function onError(observer: ObserverSubject<any>, err: any): void;
declare function onNext<T>(observer: ObserverSubject<T>, data: T): void;
declare function transform<T, F>(observer: ObserverSubject<T>, observable: ObservableSubject<F>, func: (f: F) => T, errorHandler?: (err: Error) => void): void;
declare function transformError<T, F>(observer: ObserverSubject<T>, observable: ObservableSubject<F>, func: (f: F, obs?: ObserverSubject<T>) => void, errorHandler?: (err: Error) => boolean): void;
declare function transformSingle<T>(observer: ObserverSubject<T>, observable: ObservableSubject<T>, errorHandler?: (err: Error) => void): void;
declare function transformPromise<T, F>(observer: ObserverSubject<T>, promise: Promise<F>, func: (f: F) => T, errorHandler?: (err: Error) => void): void;
declare function transformPromiseAsync<T, F>(observer: ObserverSubject<T>, promise: Promise<F>, func: (f: F, observer?: ObserverSubject<T>) => void, errorHandler?: (err: Error) => void): void;
declare function transformSinglePromise<T>(observer: ObserverSubject<T>, promise: Promise<T>, errorHandler?: (err: Error) => void): void;
declare function transformAsync<T, F>(observer: ObserverSubject<T>, observable: ObservableSubject<F>, func: TransformAsync<T, F>, errorHandler?: (err: Error) => void): void;
declare function transformSingleAsync<T>(observer: ObserverSubject<T>, observable: ObservableSubject<T>, errorHandler?: (err: Error) => void): void;
export { onNext, onError, transform, transformAsync, transformPromise, transformPromiseAsync, transformSingle, transformSingleAsync, transformSinglePromise, transformError, };
