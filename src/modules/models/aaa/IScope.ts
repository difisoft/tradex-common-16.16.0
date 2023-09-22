import ICommonForward from './ICommonForward';

export default interface IScope {
  id: number;
  name: string;
  uriPattern: string;
  forwardType: string;
  forwardData: ICommonForward;
}