import IAutoData from './IAutoData';
export default interface IStockQuote extends IAutoData {
    highTime: string;
    lowTime: string;
    bidPrice: number;
    offerPrice: number;
    floorPrice: number;
    averagePrice: number;
    referencePrice: number;
    tradingVolume: number;
    tradingValue: number;
    turnoverRate: number;
    matchingVolume: number;
    bidVolume: number;
    offerVolume: number;
    totalBidVolume: number;
    totalBidCount: number;
    totalOfferVolume: number;
    totalOfferCount: number;
    foreignerBuyVolume: number;
    foreignerSellVolume: number;
    foreignerTotalRoom: number;
    foreignerCurrentRoom: number;
    matchedBy: string;
    ceilingFloorEqual: string;
    holdVolume: number;
    holdRatio: number;
    buyAbleRatio: number;
}
