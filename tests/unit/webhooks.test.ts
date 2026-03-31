import { describe, it, expect } from 'vitest';
import { createHmac } from 'node:crypto';
import { verifyWebhookSignature, assertWebhookSignature } from '../../src/webhooks.js';
import { FellohWebhookSignatureError } from '../../src/errors.js';

const secret = 'webhook-secret-123';
const payload = '{"event":"transaction.complete","data":{"id":"txn-1"}}';

function sign(body: string, key: string): string {
  return createHmac('sha256', key).update(body).digest('hex');
}

describe('verifyWebhookSignature', () => {
  it('returns true for valid signature', () => {
    const signature = sign(payload, secret);
    expect(verifyWebhookSignature({ payload, signature, secret })).toBe(true);
  });

  it('returns false for invalid signature', () => {
    expect(verifyWebhookSignature({ payload, signature: 'invalid-hex', secret })).toBe(false);
  });

  it('returns false for wrong secret', () => {
    const signature = sign(payload, 'wrong-secret');
    expect(verifyWebhookSignature({ payload, signature, secret })).toBe(false);
  });

  it('returns false for tampered payload', () => {
    const signature = sign(payload, secret);
    expect(verifyWebhookSignature({ payload: payload + 'x', signature, secret })).toBe(false);
  });

  it('works with Buffer payload', () => {
    const buf = Buffer.from(payload);
    const signature = sign(payload, secret);
    expect(verifyWebhookSignature({ payload: buf, signature, secret })).toBe(true);
  });
});

describe('assertWebhookSignature', () => {
  it('does not throw for valid signature', () => {
    const signature = sign(payload, secret);
    expect(() => assertWebhookSignature({ payload, signature, secret })).not.toThrow();
  });

  it('throws FellohWebhookSignatureError for invalid signature', () => {
    expect(() => assertWebhookSignature({ payload, signature: 'bad', secret }))
      .toThrow(FellohWebhookSignatureError);
  });
});
