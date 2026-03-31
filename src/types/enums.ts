export interface EnumsResponse {
  currency: Record<string, EnumCurrency>;
  organisation: { feature: string[] };
  refund: { status: string[] };
  shield: { rules: string[] };
  transaction: {
    brand: string[];
    method: string[];
    status: string[];
    type: string[];
  };
  user: { role: string[] };
  payment_link_type: string[];
  booking_Package_type: string[];
}

export interface EnumCurrency {
  minor_unit: string;
  major_unit: string;
  division_factor: number;
}
