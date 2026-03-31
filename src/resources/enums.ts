import { BaseResource } from './base.js';
import type { FellohResponse } from '../types/common.js';
import type { EnumsResponse } from '../types/enums.js';

export class EnumsResource extends BaseResource {
  /** Fetch all available enum values (currencies, transaction methods, statuses, types, features, and user roles). */
  async list(): Promise<FellohResponse<EnumsResponse>> {
    return this._get<EnumsResponse>('/enums');
  }
}
