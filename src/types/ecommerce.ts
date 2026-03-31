import type { PaginationParams } from './common.js';

export interface EcommerceSession {
  id: string;
  customer_name: string;
  email: string;
  amount: number;
  currency: string;
  booking: { id: string; booking_reference: string } | null;
  customer: { id: string } | null;
  organisation: { id: string; name: string };
  open_banking_enabled: boolean;
  card_enabled: boolean;
  authorisation_only: boolean;
  surcharging_enabled: boolean;
  dcc_enabled: boolean;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateEcommerceParams {
  customer_name: string;
  email: string;
  organisation: string;
  amount: number;
  booking_id?: string;
  customer_id?: string;
  open_banking_enabled?: boolean;
  card_enabled?: boolean;
  expires_at?: string;
  currency?: string;
  authorisation_only?: boolean;
  surcharging_enabled?: boolean;
  dcc_enabled?: boolean;
  excluded_card_types?: string[];
  excluded_card_regions?: string[];
  hide_store_card?: boolean;
  store_card_forced?: boolean;
}

export interface ListEcommerceParams extends PaginationParams {
  organisation: string;
  keyword?: string;
  date_from?: string;
  date_to?: string;
  'show-child-organisations'?: boolean;
}

export interface AssignEcommerceParams {
  booking_id: string;
}
