import IAutoData from './IAutoData';

export default interface IFuturesQuote extends IAutoData {
  _id: string;
  code: string;
  time: string;
  highTime: string;
  lowTime: string;
  ceilingPrice: number;
  floorPrice: number;
  open: number;
  high: number;
  low: number;
  last: number;
  filler: string;
  change: number;
  referencePrice: number;
  averagePrice: number;
  basis: number;
  mBasis: number;
  tBasis: number;
  tPrice: number;
  disparate: number;
  disparateRate: number;
  rate: number;
  matchVolume: number;
  filler2: string;
  tradingVolume: number;
  tradingValue: number;
  bidPrice: number;
  offerPrice: number;
  filler3: string;
  bidVolume: number;
  offerVolume: number;
  accumulateBidVolume: number;
  accumulateBidCount: number;
  accumulateOfferVolume: number;
  accumulateOfferCount: number;
  foreignerBuyVolume: number;
  foreignerSellVolume: number;
  foreignerTotalRoom: number;
  foreignerCurrentRoom: number;
  sequence: number;
  date: Date;
  milliseconds: number;
  matchedBy: string;
  ceilingFloorEqual: string;
  holdVolume: number; //Total Room - Remaining Room
  holdRatio: number;//Hold Volume / Listed Quantity
  buyAbleRatio: number; //Remaining Room/Total Room
}