import { Observable, Observer } from 'rx';
import Subject = Rx.Subject;

type ObserverSubject<T> = Observer<T> | Subject<T>;
type ObservableSubject<T> = Observable<T> | Subject<T>;
type TransformAsync<T, F> = (f: F, observer?: ObserverSubject<T>) => void;

function onError(observer: ObserverSubject<any>, err: any) {
  observer.onError(err);
  observer.onCompleted();
}

function onNext<T>(observer: ObserverSubject<T>, data: T) {
  observer.onNext(data);
  observer.onCompleted();
}

function transform<T, F>(observer: ObserverSubject<T>, observable: ObservableSubject<F>
  , func: (f: F) => T, errorHandler?: (err: Error) => void): void {
  observable.subscribe(
    (data: F) => {
      try {
        observer.onNext(func(data));
      } catch (e) {
        onError(observer, e);
      }
    },
    (err: Error) => errorHandler ? errorHandler(err) : observer.onError(err),
    () => observer.onCompleted()
  );
}

function transformError<T, F>(observer: ObserverSubject<T>, observable: ObservableSubject<F>
  , func: (f: F, obs?: ObserverSubject<T>) => void, errorHandler?: (err: Error) => boolean): void {
  observable.subscribe(
    (data: F) => {
      try {
        func(data, observer);
      } catch (e) {
        onError(observer, e);
      }
    },
    (err: Error) => {
      if (!errorHandler || !errorHandler(err)) {
        observer.onError(err);
      }
    },
    () => observer.onCompleted()
  );
}

function transformSingle<T>(observer: ObserverSubject<T>, observable: ObservableSubject<T>
  , errorHandler?: (err: Error) => void): void {
  observable.subscribe(
    (data: T) => {
      try {
        observer.onNext(data);
      } catch (e) {
        onError(observer, e);
      }
    },
    (err: Error) => errorHandler ? errorHandler(err) : observer.onError(err),
    () => observer.onCompleted()
  );
}

function transformPromise<T, F>(observer: ObserverSubject<T>, promise: Promise<F>
  , func: (f: F) => T, errorHandler?: (err: Error) => void): void {
  promise.then((f: F) => {
    observer.onNext(func(f));
    observer.onCompleted();
  }).catch((err: Error) => {
    if (errorHandler) {
      errorHandler(err);
    } else {
      observer.onError(err);
      observer.onCompleted();
    }
  });
}

function transformPromiseAsync<T, F>(observer: ObserverSubject<T>, promise: Promise<F>
  , func: (f: F, observer?: ObserverSubject<T>) => void, errorHandler?: (err: Error) => void): void {
  promise.then((f: F) => {
    func(f, observer);
  }).catch((err: Error) => {
    if (errorHandler) {
      errorHandler(err);
    } else {
      observer.onError(err);
      observer.onCompleted();
    }
  });
}

function transformSinglePromise<T>(observer: ObserverSubject<T>, promise: Promise<T>
  , errorHandler?: (err: Error) => void): void {
  promise.then((data: T) => {
    observer.onNext(data);
    observer.onCompleted();
  }).catch((err: Error) => {
    if (errorHandler) {
      errorHandler(err);
    } else {
      observer.onError(err);
      observer.onCompleted();
    }
  });
}


function transformAsync<T, F>(observer: ObserverSubject<T>, observable: ObservableSubject<F>
  , func: TransformAsync<T, F>
  , errorHandler?: (err: Error) => void): void {
  observable.subscribe(
    (data: F) => {
      try {
        func(data, observer);
      } catch (e) {
        onError(observer, e);
      }
    },
    (err: Error) => errorHandler ? errorHandler(err) : observer.onError(err)
  );
}

function transformSingleAsync<T>(observer: ObserverSubject<T>
  , observable: ObservableSubject<T>
  , errorHandler?: (err: Error) => void): void {
  observable.subscribe(
    (data: T) => {
      try {
        observer.onNext(data);
      } catch (e) {
        onError(observer, e);
      }
    },
    (err: Error) => errorHandler ? errorHandler(err) : observer.onError(err)
  );
}

export {
  onNext,
  onError,
  transform,
  transformAsync,
  transformPromise,
  transformPromiseAsync,
  transformSingle,
  transformSingleAsync,
  transformSinglePromise,
  transformError,
}