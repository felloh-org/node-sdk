import type { PaginationParams } from './common.js';

export interface PaymentLink {
  id: string;
  customer_name: string;
  email: string;
  amount: number;
  currency: string;
  type: string;
  description: string | null;
  expires_at: string | null;
  booking: { id: string; booking_reference: string } | null;
  customer: { id: string } | null;
  organisation: { id: string; name: string };
  open_banking_enabled: boolean;
  card_enabled: boolean;
  authorisation_only: boolean;
  surcharging_enabled: boolean;
  dcc_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreatePaymentLinkParams {
  customer_name: string;
  email: string;
  organisation: string;
  amount: number;
  type: string;
  booking_id?: string;
  customer_id?: string;
  open_banking_enabled?: boolean;
  card_enabled?: boolean;
  description?: string;
  expires_at?: string;
  currency?: string;
  authorisation_only?: boolean;
  surcharging_enabled?: boolean;
  dcc_enabled?: boolean;
  excluded_card_types?: string[];
  excluded_card_regions?: string[];
  hide_store_card?: boolean;
  store_card_forced?: boolean;
  success_url?: string;
  failure_url?: string;
  cancel_url?: string;
}

export interface ListPaymentLinksParams extends PaginationParams {
  organisation: string;
  keyword?: string;
  'show-child-organisations'?: boolean;
  date_from?: string;
  date_to?: string;
  filter_booking_exists?: boolean;
}

export interface AssignPaymentLinkParams {
  organisation: string;
  customer_name: string;
  email: string;
  booking_reference: string;
  departure_date?: string;
  return_date?: string;
  gross_amount?: number;
}
