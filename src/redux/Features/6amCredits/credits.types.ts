
export interface WalletBonusTier {
    minWalletRechargeAmount: number;
    maxWalletRechargeAmount: number;
    minSubscriptionDays:     number;
    walletBonus:                 WalletBonus[];
}

export interface WalletBonus {
    minAmount:              number;
    maxAmount:              number | null;
    bonusType:              string;
    bonusValue:             number;
    walletCreditAfterBonus: number;
}

  
  export interface GetWalletBonusResponse {
    success: boolean;
    errors: any[];
    data: WalletBonusTier;
    statusCode: number | null;
  }
  
  export interface WalletBonusState {
    tiers: WalletBonusTier;
    loading: boolean;
    error: string | null;
  }
  