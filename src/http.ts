import type { FellohConfig, Logger } from './types/auth.js';
import type { TokenManager } from './auth.js';
import type { RequestOptions, FellohResponse } from './types/common.js';
import { FellohError, FellohNetworkError } from './errors.js';

function shouldRetry(err: unknown, attempt: number, maxRetries: number): boolean {
  if (attempt >= maxRetries) return false;
  if (err instanceof FellohError && err.statusCode >= 500) return true;
  if (err instanceof FellohNetworkError) return true;
  return false;
}

function backoff(attempt: number): Promise<void> {
  const ms = Math.min(1000 * 2 ** attempt, 10000);
  return new Promise(resolve => setTimeout(resolve, ms));
}

export class HttpClient {
  private baseUrl: string;
  private timeout: number;
  private maxRetries: number;
  private logger: Logger | undefined;

  constructor(
    private tokenManager: TokenManager,
    config: FellohConfig,
  ) {
    this.baseUrl = config.baseUrl ?? 'https://api.felloh.com';
    this.timeout = config.timeout ?? 30000;
    this.maxRetries = config.maxRetries ?? 2;
    this.logger = config.logger;
  }

  async request<T>(options: RequestOptions): Promise<FellohResponse<T>> {
    let lastError: Error | undefined;
    let hasRetried401 = false;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      const token = await this.tokenManager.getToken();

      const url = this.buildUrl(options);
      const fetchOptions: globalThis.RequestInit = {
        method: options.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
        signal: AbortSignal.timeout(this.timeout),
      };

      const startTime = Date.now();
      let response: Response;
      try {
        response = await fetch(url, fetchOptions);
      } catch (err) {
        const durationMs = Date.now() - startTime;
        this.log(options.method, url, undefined, durationMs, attempt);

        const networkErr = new FellohNetworkError(
          'Network request failed',
          err instanceof Error ? err : undefined,
        );
        if (shouldRetry(networkErr, attempt, this.maxRetries)) {
          lastError = networkErr;
          await backoff(attempt);
          continue;
        }
        throw networkErr;
      }

      const durationMs = Date.now() - startTime;
      this.log(options.method, url, response.status, durationMs, attempt);

      if (response.status === 401 && !hasRetried401) {
        hasRetried401 = true;
        await this.tokenManager.forceRefresh();
        continue;
      }

      const body = await response.json() as Record<string, unknown>;

      if (!response.ok) {
        const apiError = FellohError.fromResponse(response.status, body);
        if (shouldRetry(apiError, attempt, this.maxRetries)) {
          lastError = apiError;
          await backoff(attempt);
          continue;
        }
        throw apiError;
      }

      // Normalise meta.count from string to number (API returns it as a string)
      const meta = body.meta as Record<string, unknown> | undefined;
      if (meta && typeof meta.count === 'string') {
        meta.count = Number(meta.count);
      }

      return body as unknown as FellohResponse<T>;
    }

    throw lastError ?? new FellohNetworkError('Request failed after retries');
  }

  private buildUrl(options: RequestOptions): string {
    let url = `${this.baseUrl}${options.path}`;
    if (options.query) {
      const params = new URLSearchParams(options.query);
      url += `?${params.toString()}`;
    }
    return url;
  }

  private log(method: string, url: string, statusCode: number | undefined, durationMs: number, attempt: number): void {
    if (this.logger) {
      this.logger({ method, url, statusCode, durationMs, attempt });
    }
  }
}
