import IParamError from "./IParamError";

export default interface IStatus {
  code: string,
  message?: string,
  messageParams?: string[],
  params?: IParamError[],
}