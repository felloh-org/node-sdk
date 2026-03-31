import { BaseResource } from './base.js';
import type { FellohResponse, FellohListResponse } from '../types/common.js';
import type { ApiKey, CreateApiKeyParams, CreateApiKeyResponse, ListApiKeysParams } from '../types/api-keys.js';

export class ApiKeysResource extends BaseResource {
  /** Fetch all API keys for an organisation. */
  async list(params: ListApiKeysParams): Promise<FellohListResponse<ApiKey>> {
    return this._update<ApiKey[]>(`/token/keys`, params) as unknown as FellohListResponse<ApiKey>;
  }

  /**
   * Create a new API key pair. The `secret_key` is only returned once at creation time — store it securely.
   */
  async create(params: CreateApiKeyParams): Promise<FellohResponse<CreateApiKeyResponse>> {
    return this._update<CreateApiKeyResponse>('/token/key', params);
  }

  /** Delete an API key by ID. */
  async delete(keyId: string): Promise<FellohResponse<void>> {
    return this._remove<void>(`/token/key/${keyId}`);
  }
}
