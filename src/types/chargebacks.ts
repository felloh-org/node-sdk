import type { PaginationParams } from './common.js';

export interface Chargeback {
  transaction: {
    id: string;
    amount: number;
    booking: { id: string; booking_reference: string };
  };
  received_date: string;
  status: string;
  reason: string;
  amount: number;
  currency: string;
  due_date: string | null;
  posting_date: string | null;
  created_at: string;
}

export interface ListChargebacksParams extends PaginationParams {
  organisation: string;
  'show-child-organisations'?: boolean;
  type?: 'json' | 'csv';
}
