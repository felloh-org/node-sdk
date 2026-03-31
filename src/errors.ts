import type { FellohApiError, ResponseMeta } from './types/common.js';

/**
 * Base error class for all Felloh API errors.
 * Contains the HTTP status code, structured API error details, and response metadata.
 * Use `instanceof` to check for specific error subclasses.
 */
export class FellohError extends Error {
  constructor(
    message: string,
    /** HTTP status code (e.g. 400, 404, 500). */
    public readonly statusCode: number,
    /** Structured error details returned by the Felloh API. */
    public readonly errors: FellohApiError[],
    /** Response metadata including `request_id`. */
    public readonly meta: Partial<ResponseMeta>,
  ) {
    super(message);
    this.name = 'FellohError';
  }

  /** @internal Create the appropriate error subclass from an HTTP response. */
  static fromResponse(statusCode: number, body: Record<string, unknown>): FellohError {
    const errors = Array.isArray(body.errors) ? body.errors as FellohApiError[] : [];
    const meta = (body.meta ?? {}) as Partial<ResponseMeta>;
    const message = errors[0]?.message ?? meta.message ?? `Request failed with status ${statusCode}`;

    switch (statusCode) {
      case 401:
        return new FellohAuthenticationError(message, errors, meta);
      case 403:
        return new FellohForbiddenError(message, errors, meta);
      case 404:
        return new FellohNotFoundError(message, errors, meta);
      case 422:
        return new FellohValidationError(message, errors, meta);
      case 429:
        return new FellohRateLimitError(message, errors, meta);
      default:
        if (statusCode >= 500) return new FellohServerError(message, statusCode, errors, meta);
        return new FellohError(message, statusCode, errors, meta);
    }
  }
}

/** Thrown when API credentials are invalid or the JWT token has expired (HTTP 401). */
export class FellohAuthenticationError extends FellohError {
  constructor(message: string, errors: FellohApiError[], meta: Partial<ResponseMeta>) {
    super(message, 401, errors, meta);
    this.name = 'FellohAuthenticationError';
  }
}

/** Thrown when the authenticated user lacks permission for the requested action (HTTP 403). */
export class FellohForbiddenError extends FellohError {
  constructor(message: string, errors: FellohApiError[], meta: Partial<ResponseMeta>) {
    super(message, 403, errors, meta);
    this.name = 'FellohForbiddenError';
  }
}

/** Thrown when the requested resource does not exist (HTTP 404). */
export class FellohNotFoundError extends FellohError {
  constructor(message: string, errors: FellohApiError[], meta: Partial<ResponseMeta>) {
    super(message, 404, errors, meta);
    this.name = 'FellohNotFoundError';
  }
}

/** Thrown when the request body fails validation (HTTP 422). Check `errors` for field-level details. */
export class FellohValidationError extends FellohError {
  constructor(message: string, errors: FellohApiError[], meta: Partial<ResponseMeta>) {
    super(message, 422, errors, meta);
    this.name = 'FellohValidationError';
  }
}

/** Thrown when the API rate limit has been exceeded (HTTP 429). */
export class FellohRateLimitError extends FellohError {
  constructor(message: string, errors: FellohApiError[], meta: Partial<ResponseMeta>) {
    super(message, 429, errors, meta);
    this.name = 'FellohRateLimitError';
  }
}

/** Thrown on Felloh server errors (HTTP 5xx). The SDK automatically retries these. */
export class FellohServerError extends FellohError {
  constructor(message: string, statusCode: number, errors: FellohApiError[], meta: Partial<ResponseMeta>) {
    super(message, statusCode, errors, meta);
    this.name = 'FellohServerError';
  }
}

/** Thrown when the HTTP request fails at the network level (timeout, DNS failure, connection refused). */
export class FellohNetworkError extends FellohError {
  constructor(message: string, cause?: Error) {
    super(message, 0, [], {});
    this.name = 'FellohNetworkError';
    if (cause) this.cause = cause;
  }
}

/** Thrown by {@link assertWebhookSignature} when the HMAC signature does not match. */
export class FellohWebhookSignatureError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FellohWebhookSignatureError';
  }
}
