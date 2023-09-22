export default interface IParamError {
  code: string,
  message?: string,
  messageParams?: string[],
  param: string,
}