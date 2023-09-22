export default interface IAccountOrderHistoryRes {
    accountNumber?: string;
    stockCode?: string;
    orderDate?: string;
    orderTime?: string;
    sellBuyType?: string;
    orderType?: string;
    orderQuantity?: 0;
    orderPrice?: 0;
    orderAmount?: 0;
    matchedQuantity?: 0;
    matchedPrice?: 0;
    matchedAmount?: 0;
    matchedTime?: string;
    unmatchedQuantity?: 0;
    modifyCancelType?: string;
    modifyCancelQuantity?: 0;
    orderStatus?: string;
    orderNumber?: string;
    originalOrderNumber?: string;
    username?: string;
    userIdentifierNo?: string;
    cancelReason?: string;
}
