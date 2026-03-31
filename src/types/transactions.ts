import type { PaginationParams } from './common.js';

export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: string;
  type: string;
  transaction_reference: string | null;
  booking: {
    id: string;
    booking_reference: string;
  };
  customer: {
    id: string;
    customer_name: string;
  } | null;
  payment_link: {
    id: string;
  } | null;
  created_at: string;
  updated_at: string;
}

export interface ListTransactionsParams extends PaginationParams {
  organisation: string;
  keyword?: string;
  date_from?: string;
  date_to?: string;
  statuses?: string[];
  card_types?: string[];
  currencies?: string[];
  disbursement_id?: string;
  'show-child-organisations'?: boolean;
  type?: 'json' | 'csv';
}

export interface RefundTransactionParams {
  amount: number;
  description?: string;
  metadata?: Record<string, unknown>;
}

export interface ReassignTransactionParams {
  booking_id: string;
}
