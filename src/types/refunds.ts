import type { PaginationParams } from './common.js';

export interface Refund {
  amount: number;
  status: { id: string };
  authorisation_code: string;
  authorised_at: string | null;
  organisation: { id: string; name: string };
  completed_at: string | null;
  transaction: {
    id: string;
    amount: number;
    booking: { id: string; booking_reference: string };
  };
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface ListRefundsParams extends PaginationParams {
  organisation: string;
}
