# @felloh/node-sdk

[![CI](https://github.com/felloh-org/node-sdk/actions/workflows/ci.yml/badge.svg)](https://github.com/felloh-org/node-sdk/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@felloh/node-sdk)](https://www.npmjs.com/package/@felloh/node-sdk)

Official Node.js SDK for the [Felloh](https://www.felloh.com) payments API.

[API Documentation](https://developers.felloh.com) | [GitHub](https://github.com/felloh-org/node-sdk)

## Installation

```sh
npm install @felloh/node-sdk
```

Requires Node.js 18 or later.

## Quick Start

```typescript
import { FellohClient } from '@felloh/node-sdk';

const client = new FellohClient({
  publicKey: process.env.FELLOH_PUBLIC_KEY,
  privateKey: process.env.FELLOH_PRIVATE_KEY,
});

const bookings = await client.bookings.list({
  organisation: 'your-org-id',
});
console.log(bookings.data);
```

## Configuration

```typescript
const client = new FellohClient({
  publicKey: 'your-public-key',      // required
  privateKey: 'your-private-key',    // required
  baseUrl: 'https://api.felloh.com', // optional, default shown
  timeout: 30000,                    // optional, request timeout in ms
  maxRetries: 2,                     // optional, retries on 5xx/network errors
  tokenRefreshBuffer: 60,            // optional, seconds before expiry to refresh token
  logger: (entry) => {               // optional, called after every request
    console.log(`${entry.method} ${entry.url} ${entry.statusCode} ${entry.durationMs}ms`);
  },
});
```

## Usage

### Bookings

```typescript
// List (with filters)
const bookings = await client.bookings.list({
  organisation: 'org-id',
  keyword: 'james@example.com',
  take: 20,
});

// Auto-paginate
for await (const booking of client.bookings.listAll({ organisation: 'org-id' })) {
  console.log(booking.id);
}

// Get single
const booking = await client.bookings.get('booking-id');

// Create
const created = await client.bookings.create({
  organisation: 'org-id',
  booking_reference: 'REF-001',
  customer_name: 'James Dean',
  email: 'james@example.com',
  currency: 'GBX',
  gross_amount: 100000, // amounts in lowest denomination (pence)
});

// Update
await client.bookings.update('booking-id', { customer_name: 'Jane Dean' });

// Delete
await client.bookings.delete('booking-id');
```

### Transactions

```typescript
// List with filters
const transactions = await client.transactions.list({
  organisation: 'org-id',
  statuses: ['COMPLETE'],
  date_from: '2024-01-01',
  date_to: '2024-12-31',
});

// Refund
await client.transactions.refund('transaction-id', { amount: 5000 });

// Complete pre-auth
await client.transactions.complete('transaction-id');

// Reverse pre-auth
await client.transactions.reverse('transaction-id');

// Re-assign to different booking
await client.transactions.reassign('transaction-id', { booking_id: 'booking-id' });
```

### Payment Links

```typescript
const link = await client.paymentLinks.create({
  customer_name: 'John Doe',
  email: 'john@example.com',
  organisation: 'org-id',
  amount: 50000,
  type: 'CARD',
});
```

### Customers

```typescript
const customer = await client.customers.create({
  organisation: 'org-id',
  customer_name: 'Jane Smith',
  email: 'jane@example.com',
  address_1: '123 High Street',
  city: 'London',
  county: 'Greater London',
  post_code: 'SW1A 1AA',
});
```

### All Resources

| Resource | Property |
|---|---|
| Organisations | `client.organisations` |
| Bookings | `client.bookings` |
| Booking Components | `client.bookingComponents` |
| Transactions | `client.transactions` |
| Customers | `client.customers` |
| Payment Links | `client.paymentLinks` |
| Ecommerce | `client.ecommerce` |
| Refunds | `client.refunds` |
| Charges | `client.charges` |
| Chargebacks | `client.chargebacks` |
| Credit Notes | `client.creditNotes` |
| Suppliers | `client.suppliers` |
| Beneficiaries | `client.beneficiaries` |
| Disbursements | `client.disbursements` |
| Ledger | `client.ledger` |
| Acquirer Settlement | `client.batches` |
| API Keys | `client.apiKeys` |
| Audit | `client.audit` |
| AISP | `client.aisp` |
| Scheduled Payments | `client.scheduledPayments` |
| Enums | `client.enums` |

## Pagination

All list endpoints support manual pagination via `skip` and `take` parameters:

```typescript
const page = await client.bookings.list({ organisation: 'org-id', skip: 0, take: 20 });
console.log(page.meta.count); // total count
```

Most resources also provide a `listAll()` method that returns an `AsyncIterable` for automatic pagination:

```typescript
import { toArray } from '@felloh/node-sdk';

// Iterate one by one
for await (const booking of client.bookings.listAll({ organisation: 'org-id' })) {
  console.log(booking.id);
}

// Or collect all into an array
const all = await toArray(client.bookings.listAll({ organisation: 'org-id' }));
```

## Webhook Verification

```typescript
import { verifyWebhookSignature, assertWebhookSignature } from '@felloh/node-sdk';

// Returns boolean
const isValid = verifyWebhookSignature({
  payload: rawRequestBody,
  signature: req.headers['x-signature'],
  secret: 'your-webhook-secret',
});

// Or throw on failure
assertWebhookSignature({
  payload: rawRequestBody,
  signature: req.headers['x-signature'],
  secret: 'your-webhook-secret',
});
```

## Error Handling

The SDK throws typed errors for different HTTP status codes:

```typescript
import {
  FellohError,
  FellohNotFoundError,
  FellohValidationError,
} from '@felloh/node-sdk';

try {
  await client.bookings.get('non-existent');
} catch (err) {
  if (err instanceof FellohNotFoundError) {
    console.log('Booking not found');
  }
  if (err instanceof FellohError) {
    console.log(err.statusCode);  // HTTP status code
    console.log(err.errors);      // API error details
    console.log(err.meta);        // Response metadata including request_id
  }
}
```

| Error Class | Status Code |
|---|---|
| `FellohAuthenticationError` | 401 |
| `FellohForbiddenError` | 403 |
| `FellohNotFoundError` | 404 |
| `FellohValidationError` | 422 |
| `FellohRateLimitError` | 429 |
| `FellohServerError` | 5xx |
| `FellohNetworkError` | Network failures |

## Logging

Pass a `logger` callback to observe every HTTP request:

```typescript
import type { LogEntry } from '@felloh/node-sdk';

const client = new FellohClient({
  publicKey: '...',
  privateKey: '...',
  logger: (entry: LogEntry) => {
    console.log(`${entry.method} ${entry.url} → ${entry.statusCode} (${entry.durationMs}ms)`);
  },
});
```

Each `LogEntry` includes `method`, `url`, `statusCode`, `durationMs`, and `attempt` (retry count).

## Token Management

The SDK automatically handles JWT token acquisition and refresh. Tokens are cached and proactively refreshed before expiry. No manual token management is needed.

## Development

```sh
npm install
npm test                # unit tests
npm run test:integration # integration tests (requires sandbox credentials)
npm run build           # compile ESM + CJS
npm run typecheck       # type check without emitting
```

## License

MIT - see [LICENSE](LICENSE) for details.
