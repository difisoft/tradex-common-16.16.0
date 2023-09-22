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
  totalBidVolume: number; //accumulateBidVolume
  totalBidCount: number; //accumulateBidCount
  totalOfferVolume: number; //accumulateOfferVolume
  totalOfferCount: number; //accumulateOfferCount
  foreignerBuyVolume: number;
  foreignerSellVolume: number;
  foreignerTotalRoom: number;
  foreignerCurrentRoom: number;
  matchedBy: string;
  ceilingFloorEqual: string;
  holdVolume: number; //Total Room - Remaining Room
  holdRatio: number; //Hold Volume / Listed Quantity
  buyAbleRatio: number; //Remaining Room/Total Room
}