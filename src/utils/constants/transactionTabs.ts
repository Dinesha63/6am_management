export type TransactionTabType = 'All' | 'Credits Added' | 'Purchases';

export const TRANSACTIONTABS: TransactionTabType[] = [
  'All',
  'Credits Added',
  'Purchases',
];



// ex: 
// import { TRANSACTIONTABS, TransactionTabType } from '../constants/transactionTabs';

// const activeTab: TransactionTabType = 'All';
// console.log(TRANSACTIONTABS); // ['All', 'Credits Added', 'Purchases']
