import { BaseResource } from './base.js';
import type { FellohResponse } from '../types/common.js';
import type { Organisation } from '../types/organisations.js';

export class OrganisationsResource extends BaseResource {
  /** Fetch all organisations accessible with your API credentials. */
  async list(): Promise<FellohResponse<Organisation[]>> {
    return this.http.request<Organisation[]>({ method: 'GET', path: '/user/organisations' });
  }
}
