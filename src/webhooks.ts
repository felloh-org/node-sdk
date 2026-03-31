import { createHmac, timingSafeEqual } from 'node:crypto';
import { FellohWebhookSignatureError } from './errors.js';

/** Options for verifying a Felloh webhook signature. */
export interface WebhookVerifyOptions {
  /** The raw request body (string or Buffer). Must not be parsed or modified. */
  payload: string | Buffer;
  /** The value of the `X-Signature` header from the webhook request. */
  signature: string;
  /** Your webhook signing secret from the Felloh dashboard. */
  secret: string;
}

/**
 * Verify a Felloh webhook signature using HMAC-SHA256 with timing-safe comparison.
 * @returns `true` if the signature is valid, `false` otherwise.
 */
export function verifyWebhookSignature(options: WebhookVerifyOptions): boolean {
  const { payload, signature, secret } = options;
  const expected = createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  if (expected.length !== signature.length) return false;

  return timingSafeEqual(
    Buffer.from(signature, 'utf8'),
    Buffer.from(expected, 'utf8'),
  );
}

/**
 * Verify a Felloh webhook signature, throwing {@link FellohWebhookSignatureError} if invalid.
 * @throws {FellohWebhookSignatureError} When the signature does not match.
 */
export function assertWebhookSignature(options: WebhookVerifyOptions): void {
  if (!verifyWebhookSignature(options)) {
    throw new FellohWebhookSignatureError('Webhook signature verification failed');
  }
}
