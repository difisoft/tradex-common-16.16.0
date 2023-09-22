"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformError = exports.transformSinglePromise = exports.transformSingleAsync = exports.transformSingle = exports.transformPromiseAsync = exports.transformPromise = exports.transformAsync = exports.transform = exports.onError = exports.onNext = void 0;
function onError(observer, err) {
    observer.onError(err);
    observer.onCompleted();
}
exports.onError = onError;
function onNext(observer, data) {
    observer.onNext(data);
    observer.onCompleted();
}
exports.onNext = onNext;
function transform(observer, observable, func, errorHandler) {
    observable.subscribe((data) => {
        try {
            observer.onNext(func(data));
        }
        catch (e) {
            onError(observer, e);
        }
    }, (err) => errorHandler ? errorHandler(err) : observer.onError(err), () => observer.onCompleted());
}
exports.transform = transform;
function transformError(observer, observable, func, errorHandler) {
    observable.subscribe((data) => {
        try {
            func(data, observer);
        }
        catch (e) {
            onError(observer, e);
        }
    }, (err) => {
        if (!errorHandler || !errorHandler(err)) {
            observer.onError(err);
        }
    }, () => observer.onCompleted());
}
exports.transformError = transformError;
function transformSingle(observer, observable, errorHandler) {
    observable.subscribe((data) => {
        try {
            observer.onNext(data);
        }
        catch (e) {
            onError(observer, e);
        }
    }, (err) => errorHandler ? errorHandler(err) : observer.onError(err), () => observer.onCompleted());
}
exports.transformSingle = transformSingle;
function transformPromise(observer, promise, func, errorHandler) {
    promise.then((f) => {
        observer.onNext(func(f));
        observer.onCompleted();
    }).catch((err) => {
        if (errorHandler) {
            errorHandler(err);
        }
        else {
            observer.onError(err);
            observer.onCompleted();
        }
    });
}
exports.transformPromise = transformPromise;
function transformPromiseAsync(observer, promise, func, errorHandler) {
    promise.then((f) => {
        func(f, observer);
    }).catch((err) => {
        if (errorHandler) {
            errorHandler(err);
        }
        else {
            observer.onError(err);
            observer.onCompleted();
        }
    });
}
exports.transformPromiseAsync = transformPromiseAsync;
function transformSinglePromise(observer, promise, errorHandler) {
    promise.then((data) => {
        observer.onNext(data);
        observer.onCompleted();
    }).catch((err) => {
        if (errorHandler) {
            errorHandler(err);
        }
        else {
            observer.onError(err);
            observer.onCompleted();
        }
    });
}
exports.transformSinglePromise = transformSinglePromise;
function transformAsync(observer, observable, func, errorHandler) {
    observable.subscribe((data) => {
        try {
            func(data, observer);
        }
        catch (e) {
            onError(observer, e);
        }
    }, (err) => errorHandler ? errorHandler(err) : observer.onError(err));
}
exports.transformAsync = transformAsync;
function transformSingleAsync(observer, observable, errorHandler) {
    observable.subscribe((data) => {
        try {
            observer.onNext(data);
        }
        catch (e) {
            onError(observer, e);
        }
    }, (err) => errorHandler ? errorHandler(err) : observer.onError(err));
}
exports.transformSingleAsync = transformSingleAsync;
//# sourceMappingURL=rx.js.map