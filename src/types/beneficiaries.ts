import type { PaginationParams } from './common.js';

export interface Beneficiary {
  id: string;
  organisation: { id: string; name: string };
  bank: {
    iban: string | null;
    account_number: string;
    sort_code: string;
    name: string;
  };
  is_active: boolean;
}

export interface CreateBeneficiaryParams {
  organisation: string;
  account_name: string;
  account_number: string;
  sort_code: string;
}

export interface ListBeneficiariesParams extends PaginationParams {
  organisation: string;
  'show-child-organisations'?: boolean;
  type?: 'json' | 'csv';
}
