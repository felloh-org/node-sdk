import { BaseResource } from './base.js';
import type { FellohResponse, FellohListResponse } from '../types/common.js';
import type { AispAccount, AispTransaction, AispStatistics, ListAispTransactionsParams } from '../types/aisp.js';

export class AispResource extends BaseResource {
  /** Fetch all bank accounts linked to an organisation via AISP (Account Information Service Provider). */
  async accounts(organisation: string): Promise<FellohResponse<AispAccount[]>> {
    return this.http.request<AispAccount[]>({ method: 'GET', path: '/aisp/accounts', query: { organisation } });
  }

  /** Fetch a paginated list of bank transactions. Supports date range and credit/debit filtering. */
  async transactions(params: ListAispTransactionsParams): Promise<FellohListResponse<AispTransaction>> {
    return this._list<AispTransaction>('/aisp/transactions', params);
  }

  /** Fetch aggregate statistics (total balance, account count) for an organisation's linked bank accounts. */
  async statistics(organisation: string): Promise<FellohResponse<AispStatistics>> {
    return this.http.request<AispStatistics>({ method: 'GET', path: '/aisp/statistics', query: { organisation } });
  }
}
