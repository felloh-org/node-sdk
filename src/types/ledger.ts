import type { PaginationParams } from './common.js';

export interface LedgerEntry {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  currency: string;
  source: string;
  created_at: string;
  transaction?: { id: string; amount: number };
  disbursal?: { id: string; amount: number };
  amendment?: { id: string; amount: number };
}

export interface ListLedgerParams extends PaginationParams {
  organisation: string;
  keyword?: string;
  type?: 'json' | 'csv';
}
