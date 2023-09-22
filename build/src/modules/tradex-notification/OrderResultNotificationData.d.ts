import ITemplateData from './ITemplateData';
export default class OrderResultNotificationData implements ITemplateData {
    status: string;
    message: string;
    accountNumber: string;
    subNumber: string;
    stockCode: string;
    orderQuantity: number;
    orderPrice: number;
    sellBuyType: string;
    orderType: string;
    getTemplate(): string;
}
