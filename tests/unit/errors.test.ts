import { describe, it, expect } from 'vitest';
import {
  FellohError,
  FellohAuthenticationError,
  FellohForbiddenError,
  FellohNotFoundError,
  FellohValidationError,
  FellohRateLimitError,
  FellohServerError,
  FellohNetworkError,
  FellohWebhookSignatureError,
} from '../../src/errors.js';

describe('FellohError.fromResponse', () => {
  it('returns FellohAuthenticationError for 401', () => {
    const err = FellohError.fromResponse(401, { errors: [], meta: { message: 'Unauthorized' } });
    expect(err).toBeInstanceOf(FellohAuthenticationError);
    expect(err.statusCode).toBe(401);
    expect(err.message).toBe('Unauthorized');
  });

  it('returns FellohForbiddenError for 403', () => {
    const err = FellohError.fromResponse(403, { errors: [], meta: {} });
    expect(err).toBeInstanceOf(FellohForbiddenError);
    expect(err.statusCode).toBe(403);
  });

  it('returns FellohNotFoundError for 404', () => {
    const err = FellohError.fromResponse(404, {
      errors: [{ message: 'Booking not found', title: 'Not Found', type: 'not_found', code: 'booking.not_found', documentation_url: '' }],
      meta: {},
    });
    expect(err).toBeInstanceOf(FellohNotFoundError);
    expect(err.message).toBe('Booking not found');
    expect(err.errors).toHaveLength(1);
  });

  it('returns FellohValidationError for 422', () => {
    const err = FellohError.fromResponse(422, { errors: [], meta: {} });
    expect(err).toBeInstanceOf(FellohValidationError);
    expect(err.statusCode).toBe(422);
  });

  it('returns FellohRateLimitError for 429', () => {
    const err = FellohError.fromResponse(429, { errors: [], meta: {} });
    expect(err).toBeInstanceOf(FellohRateLimitError);
    expect(err.statusCode).toBe(429);
  });

  it('returns FellohServerError for 5xx', () => {
    const err = FellohError.fromResponse(502, { errors: [], meta: {} });
    expect(err).toBeInstanceOf(FellohServerError);
    expect(err.statusCode).toBe(502);
  });

  it('returns base FellohError for other status codes', () => {
    const err = FellohError.fromResponse(400, { errors: [], meta: { message: 'Bad request' } });
    expect(err).toBeInstanceOf(FellohError);
    expect(err).not.toBeInstanceOf(FellohServerError);
    expect(err.statusCode).toBe(400);
  });

  it('uses meta.message when no errors present', () => {
    const err = FellohError.fromResponse(400, { errors: [], meta: { message: 'Something went wrong' } });
    expect(err.message).toBe('Something went wrong');
  });

  it('falls back to default message', () => {
    const err = FellohError.fromResponse(418, { errors: [], meta: {} });
    expect(err.message).toBe('Request failed with status 418');
  });
});

describe('FellohNetworkError', () => {
  it('has statusCode 0 and preserves cause', () => {
    const cause = new Error('ECONNREFUSED');
    const err = new FellohNetworkError('Network failed', cause);
    expect(err.statusCode).toBe(0);
    expect(err.cause).toBe(cause);
    expect(err.name).toBe('FellohNetworkError');
  });
});

describe('FellohWebhookSignatureError', () => {
  it('has correct name', () => {
    const err = new FellohWebhookSignatureError('bad sig');
    expect(err.name).toBe('FellohWebhookSignatureError');
    expect(err.message).toBe('bad sig');
  });
});
