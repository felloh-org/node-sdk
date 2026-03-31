import type { PaginationParams } from './common.js';

export interface Booking {
  id: string;
  gross_amount: number;
  currency: string;
  email: string;
  atol_receipt_number: string | null;
  user: { id: string; email: string };
  components: BookingComponent[];
  transactions: CompactTransaction[];
  payment_links: CompactPaymentLink[];
  package_type: { id: string; created_at: string } | null;
  scheduled_transactions: CompactScheduledPayment[];
  customer_name: string;
  booking_reference: string;
  departure_date: string | null;
  return_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface BookingComponent {
  id: string;
  supplier: { id: string; name: string };
  amount: number;
  currency: string;
  booking_reference: string;
  destination_air: string | null;
  type: string | null;
}

interface CompactTransaction {
  id: string;
  amount: number;
  status: { id: string };
}

interface CompactPaymentLink {
  id: string;
  amount: number;
}

interface CompactScheduledPayment {
  id: string;
  amount: number;
  date: string;
}

export interface CreateBookingParams {
  organisation: string;
  booking_reference: string;
  customer_name: string;
  email: string;
  currency?: string;
  departure_date?: string;
  return_date?: string;
  gross_amount?: number;
  atol_receipt_number?: string;
  package_type?: string;
}

export interface UpdateBookingParams {
  gross_value?: string;
  departure_date?: string;
  return_date?: string;
  customer_name?: string;
  email?: string;
  package_type?: string;
  atol_receipt_number?: string;
}

export interface ListBookingsParams extends PaginationParams {
  organisation: string;
  keyword?: string;
  'show-child-organisations'?: boolean;
  type?: 'json' | 'csv';
  date_from?: string;
  date_to?: string;
  booking_reference?: string;
}
