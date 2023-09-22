import SystemError from "../errors/SystemError";
import { Observer } from 'rx';

const doSafe = (observable: Observer<any>, func: any) => {
  try {
    func();
  } catch (e) {
    observable.onError(new SystemError(e));
    observable.onCompleted();
  }
};

export {
  doSafe
}