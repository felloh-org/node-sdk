import type { FellohConfig } from './types/auth.js';
import { FellohAuthenticationError, FellohNetworkError } from './errors.js';

export class TokenManager {
  private token: string | null = null;
  private expiresAt = 0;
  private refreshPromise: Promise<void> | null = null;
  private baseUrl: string;
  private refreshBuffer: number;

  constructor(private config: FellohConfig) {
    this.baseUrl = config.baseUrl ?? 'https://api.felloh.com';
    this.refreshBuffer = config.tokenRefreshBuffer ?? 60;
  }

  async getToken(): Promise<string> {
    const now = Math.floor(Date.now() / 1000);
    if (this.token && now < this.expiresAt - this.refreshBuffer) {
      return this.token;
    }
    await this.refresh();
    return this.token!;
  }

  async forceRefresh(): Promise<void> {
    this.token = null;
    this.expiresAt = 0;
    await this.refresh();
  }

  private async refresh(): Promise<void> {
    if (this.refreshPromise) {
      await this.refreshPromise;
      return;
    }

    this.refreshPromise = this.doRefresh();
    try {
      await this.refreshPromise;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async doRefresh(): Promise<void> {
    let response: Response;
    try {
      response = await fetch(`${this.baseUrl}/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          public_key: this.config.publicKey,
          private_key: this.config.privateKey,
        }),
      });
    } catch (err) {
      throw new FellohNetworkError(
        'Failed to connect to Felloh API for token refresh',
        err instanceof Error ? err : undefined,
      );
    }

    if (!response.ok) {
      const body = await response.json().catch(() => ({})) as Record<string, any>;
      const errors = Array.isArray(body?.errors) ? body.errors : [];
      const message = errors[0]?.message ?? body?.meta?.message ?? 'Authentication failed';
      throw new FellohAuthenticationError(
        message,
        errors,
        body?.meta ?? {},
      );
    }

    const body = await response.json() as Record<string, any>;
    this.token = body.data.token;
    this.expiresAt = body.data.expiry_time;
  }
}
