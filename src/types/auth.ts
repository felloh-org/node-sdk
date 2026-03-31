export interface TokenResponse {
  token: string;
  expiry_time: number;
  type: string;
}

/**
 * Log entry emitted by the SDK for each HTTP request.
 * Passed to the {@link FellohConfig.logger} callback.
 */
export interface LogEntry {
  /** HTTP method (GET, POST, PUT, DELETE). */
  method: string;
  /** Full request URL including query string. */
  url: string;
  /** HTTP status code of the response, or `undefined` if the request failed before a response was received. */
  statusCode: number | undefined;
  /** Request duration in milliseconds. */
  durationMs: number;
  /** The retry attempt number (0 for the first attempt). */
  attempt: number;
}

/** Callback invoked after every HTTP request completes (or fails). */
export type Logger = (entry: LogEntry) => void;

/** Configuration options for the Felloh SDK client. */
export interface FellohConfig {
  /** Your Felloh public API key. */
  publicKey: string;
  /** Your Felloh private API key. */
  privateKey: string;
  /** Base URL for the Felloh API. Defaults to `'https://api.felloh.com'`. */
  baseUrl?: string;
  /** Seconds before token expiry to proactively refresh. Defaults to `60`. */
  tokenRefreshBuffer?: number;
  /** Request timeout in milliseconds. Defaults to `30000`. */
  timeout?: number;
  /** Number of retries on 5xx or network errors. Defaults to `2`. */
  maxRetries?: number;
  /** Optional callback invoked after every HTTP request for logging/observability. */
  logger?: Logger;
}
