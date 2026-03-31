import type { PaginationParams } from './common.js';

export interface CreditNote {
  id: string;
  short_id: string;
  customer_name: string;
  amount: number;
  description: string;
  currency: string;
  organisation: { id: string; name: string };
  booking_applied_to: { id: string; booking_reference: string } | null;
  booking_created_from: { id: string; booking_reference: string } | null;
  created_at: string;
}

export interface CreateCreditNoteParams {
  organisation: string;
  customer_name: string;
  amount: number;
  currency?: string;
}

export interface AssignCreditNoteParams {
  organisation: string;
  customer_name: string;
  email: string;
  booking_reference: string;
  departure_date?: string;
  return_date?: string;
  gross_amount?: number;
}

export interface ListCreditNotesParams extends PaginationParams {
  organisation: string;
}
