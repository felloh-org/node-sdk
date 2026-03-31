import type { PaginationParams } from './common.js';

export interface Charge {
  booking: { id: string; booking_reference: string };
  charges: {
    amount: number;
    currency: string;
    rate: number;
  };
  metadata: {
    level: string;
    card_type: string;
    country_type: string;
    payment_brand: string;
  };
  transaction: {
    id: string;
    amount: number;
    created_at: string;
  };
}

export interface ListChargesParams extends PaginationParams {
  organisation: string;
  date_from?: string;
  date_to?: string;
}
