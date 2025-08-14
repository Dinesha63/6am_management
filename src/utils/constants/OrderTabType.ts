export enum OrderTabType {
  PROCESSING = 'Processing',
  SHIPPED = 'Shipped',
  COMPLETED = 'Completed',
  CANCELED = 'Canceled',
}

export const TABS = [
  OrderTabType.PROCESSING,
  OrderTabType.SHIPPED,
  OrderTabType.COMPLETED,
  OrderTabType.CANCELED,
];