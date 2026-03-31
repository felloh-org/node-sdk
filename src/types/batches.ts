import type { PaginationParams } from './common.js';

export interface Batch {
  id: string;
  bank_reference: string;
  amount: number;
  posting_date: string;
  currency: string;
  payment_provider: {
    id: string;
    name: string;
    payment_method: string;
  };
  adjustment_count: number;
  transaction_count: number;
}

export interface ListBatchesParams extends PaginationParams {
  organisation: string;
}
