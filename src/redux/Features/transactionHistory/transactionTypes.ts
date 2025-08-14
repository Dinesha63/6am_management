export interface TransactionItem {
  transactionDate: string;
  orderNo: string;
  orderType: string;
  amount: number;
  paymentMethod: string;
  transactionType: string;
}

export interface TransactionResponse {
  success: boolean;
  errors: any[];
  data: TransactionItem[];
  statusCode: any;
}
