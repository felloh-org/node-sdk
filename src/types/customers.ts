import type { PaginationParams } from './common.js';

export interface Customer {
  id: string;
  customer_name: string;
  email: string;
  address_1: string | null;
  address_2: string | null;
  city: string | null;
  county: string | null;
  country: string | null;
  post_code: string | null;
}

export interface CreateCustomerParams {
  organisation: string;
  customer_name: string;
  email: string;
  address_1: string;
  city: string;
  county: string;
  post_code: string;
  address_2?: string;
  country?: string;
}

export interface ListCustomersParams extends PaginationParams {
  organisation: string;
  keyword?: string;
  'show-child-organisations'?: boolean;
}
