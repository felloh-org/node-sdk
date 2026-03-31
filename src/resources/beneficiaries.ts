import { BaseResource } from './base.js';
import type { FellohResponse, FellohListResponse } from '../types/common.js';
import type { Beneficiary, CreateBeneficiaryParams, ListBeneficiariesParams } from '../types/beneficiaries.js';

export class BeneficiariesResource extends BaseResource {
  /** Fetch a paginated list of beneficiaries (bank accounts for disbursements). Supports CSV export. */
  async list(params: ListBeneficiariesParams): Promise<FellohListResponse<Beneficiary>> {
    return this._list<Beneficiary>('/ledger/beneficiaries', params);
  }

  /** Auto-paginate through all beneficiaries. Returns an `AsyncIterable`. */
  listAll(params: Omit<ListBeneficiariesParams, 'skip' | 'take'>): AsyncIterable<Beneficiary> {
    return this._paginate<Beneficiary>('/ledger/beneficiaries', params);
  }

  /** Create a new beneficiary bank account. */
  async create(params: CreateBeneficiaryParams): Promise<FellohResponse<Beneficiary>> {
    return this._create<Beneficiary>('/ledger/beneficiaries', params);
  }

  /** Activate an inactive beneficiary, enabling it to receive disbursements. */
  async activate(beneficiaryId: string): Promise<FellohResponse<void>> {
    return this._create<void>(`/ledger/beneficiaries/${beneficiaryId}/activate`, {});
  }
}
