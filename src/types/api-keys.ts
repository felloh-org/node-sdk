export interface ApiKey {
  id: string;
  name: string;
  public_key: string;
  created_at: string;
}

export interface CreateApiKeyParams {
  organisation: string;
  name: string;
}

export interface CreateApiKeyResponse {
  name: string;
  public_key: string;
  secret_key: string;
}

export interface ListApiKeysParams {
  organisation: string;
}
