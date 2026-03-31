import { describe, it, expect } from 'vitest';
import { createHmac } from 'node:crypto';
import { verifyWebhookSignature, assertWebhookSignature } from '../../src/webhooks.js';
import { FellohWebhookSignatureError } from '../../src/errors.js';

// Webhook verification is purely local crypto — no sandbox API needed.
// But we include it in the integration suite for completeness.

describe('Webhook Signature Verification', () => {
  const secret = 'test-webhook-secret-for-integration';

  const payload = JSON.stringify({
    event: 'transaction.complete',
    data: {
      id: 'txn-12345',
      amount: 50000,
      currency: 'GBX',
      status: { id: 'COMPLETE' },
    },
  });

  const validSignature = createHmac('sha256', secret).update(payload).digest('hex');

  it('verifies a valid webhook signature', () => {
    expect(verifyWebhookSignature({ payload, signature: validSignature, secret })).toBe(true);
  });

  it('rejects an invalid webhook signature', () => {
    expect(verifyWebhookSignature({ payload, signature: 'tampered', secret })).toBe(false);
  });

  it('rejects a signature from a different secret', () => {
    const wrongSig = createHmac('sha256', 'wrong-secret').update(payload).digest('hex');
    expect(verifyWebhookSignature({ payload, signature: wrongSig, secret })).toBe(false);
  });

  it('assertWebhookSignature passes for valid signature', () => {
    expect(() => assertWebhookSignature({ payload, signature: validSignature, secret })).not.toThrow();
  });

  it('assertWebhookSignature throws for invalid signature', () => {
    expect(() => assertWebhookSignature({ payload, signature: 'bad', secret }))
      .toThrow(FellohWebhookSignatureError);
  });

  it('handles Buffer payload', () => {
    const buf = Buffer.from(payload);
    expect(verifyWebhookSignature({ payload: buf, signature: validSignature, secret })).toBe(true);
  });
});
