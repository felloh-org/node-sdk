import type { PaginationParams } from './common.js';

export interface Disbursement {
  id: string;
  amount: number;
  currency: string;
  bank_reference: string;
  created_at: string;
  receiving_account: {
    iban: string | null;
    account_number: string;
    sort_code: string;
    name: string;
  };
  transactions: {
    id: string;
    amount: number;
    booking: { id: string; booking_reference: string };
  }[];
}

export interface ListDisbursementsParams extends PaginationParams {
  organisation: string;
  'show-child-organisations'?: boolean;
  type?: 'json' | 'csv';
  date_from?: string;
  date_to?: string;
  keyword?: string;
}
