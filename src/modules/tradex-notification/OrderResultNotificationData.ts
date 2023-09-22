import ITemplateData from './ITemplateData';

export default class OrderResultNotificationData implements ITemplateData {
  public status: string;
  public message: string;
  public accountNumber: string;
  public subNumber: string;
  public stockCode: string;
  public orderQuantity: number;
  public orderPrice: number;
  public sellBuyType: string;
  public orderType: string;

  public getTemplate(): string {
    return 'order_result_notification';
  }
}