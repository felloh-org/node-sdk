export interface CreateBookingComponentParams {
  supplier: string;
  amount: number;
  currency: string;
  booking_reference: string;
  destination_air?: string;
  type?: string;
}
