import type { PaginationParams } from './common.js';

export interface ScheduledPayment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  execute_after: string | null;
  booking: { id: string; booking_reference: string };
  customer: { id: string; customer_name: string } | null;
  organisation: { id: string; name: string };
  transaction: { id: string } | null;
  created_at: string;
}

export interface ListScheduledPaymentsParams extends PaginationParams {
  organisation: string;
  keyword?: string;
  sort_by?: 'amount' | 'created_at' | 'execute_after' | 'status';
  direction?: 'asc' | 'desc';
  'show-child-organisations'?: boolean;
}

export interface AvailableToken {
  id: string;
  cardholder_name: string;
  bin: string;
  card_brand: string;
  organisation_id: string;
}

export interface CreateScheduledPaymentParams {
  token: string;
  amount: number;
  date?: string;
}

export interface CreateApprovalLinkParams {
  amount: number;
  token: string;
  date?: string;
}
