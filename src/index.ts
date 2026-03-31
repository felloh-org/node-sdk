export { FellohClient } from './client.js';
export type { FellohConfig } from './types/auth.js';
export type { LogEntry, Logger } from './types/auth.js';

export {
  FellohError,
  FellohAuthenticationError,
  FellohForbiddenError,
  FellohNotFoundError,
  FellohValidationError,
  FellohRateLimitError,
  FellohServerError,
  FellohNetworkError,
  FellohWebhookSignatureError,
} from './errors.js';

export { verifyWebhookSignature, assertWebhookSignature } from './webhooks.js';
export type { WebhookVerifyOptions } from './webhooks.js';

export { toArray } from './pagination.js';

export type * from './types/index.js';
