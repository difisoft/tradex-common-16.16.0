import MethodEnum from "./MethodEnum";

export default interface IConfiguration {
  domain?: string;
  getMethod(): MethodEnum;
}