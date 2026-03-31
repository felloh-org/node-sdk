import type { PaginationParams } from './common.js';

export interface Supplier {
  id: string;
  name: string;
  created_at: string;
}

export interface CreateSupplierParams {
  organisation: string;
  supplier_name?: string;
}

export interface ListSuppliersParams extends PaginationParams {
  organisation: string;
  keyword?: string;
}
