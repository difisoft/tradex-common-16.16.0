export default interface IAccountStockBalanceRequest {
    accountNumber: string;
    subNumber?: string;
    next?: boolean;
    fetchCount?: number;
}
