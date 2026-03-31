import type { PaginationParams } from './common.js';

export interface AispAccount {
  id: string;
  iban: string;
  account_number: string;
  sort_code: string;
  name: string;
  balance: number;
  currency: string;
}

export interface AispTransaction {
  id: string;
  amount: number;
  currency: string;
  type: 'credit' | 'debit';
  description: string;
  created_at: string;
}

export interface AispStatistics {
  total_balance: number;
  currency: string;
  account_count: number;
}

export interface ListAispTransactionsParams extends PaginationParams {
  organisation: string;
  account_iban?: string;
  date_from?: string;
  date_to?: string;
  type?: 'credit' | 'debit';
}
