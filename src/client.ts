import type { FellohConfig } from './types/auth.js';
import { TokenManager } from './auth.js';
import { HttpClient } from './http.js';
import { OrganisationsResource } from './resources/organisations.js';
import { BookingsResource } from './resources/bookings.js';
import { BookingComponentsResource } from './resources/booking-components.js';
import { TransactionsResource } from './resources/transactions.js';
import { CustomersResource } from './resources/customers.js';
import { PaymentLinksResource } from './resources/payment-links.js';
import { EcommerceResource } from './resources/ecommerce.js';
import { RefundsResource } from './resources/refunds.js';
import { ChargesResource } from './resources/charges.js';
import { ChargebacksResource } from './resources/chargebacks.js';
import { CreditNotesResource } from './resources/credit-notes.js';
import { SuppliersResource } from './resources/suppliers.js';
import { BeneficiariesResource } from './resources/beneficiaries.js';
import { DisbursementsResource } from './resources/disbursements.js';
import { LedgerResource } from './resources/ledger.js';
import { BatchesResource } from './resources/batches.js';
import { ApiKeysResource } from './resources/api-keys.js';
import { AuditResource } from './resources/audit.js';
import { AispResource } from './resources/aisp.js';
import { ScheduledPaymentsResource } from './resources/scheduled-payments.js';
import { EnumsResource } from './resources/enums.js';

export type { FellohConfig } from './types/auth.js';

/**
 * Main client for the Felloh payment API.
 *
 * @example
 * ```typescript
 * const client = new FellohClient({
 *   publicKey: process.env.FELLOH_PUBLIC_KEY,
 *   privateKey: process.env.FELLOH_PRIVATE_KEY,
 * });
 *
 * const bookings = await client.bookings.list({ organisation: 'org-id' });
 * ```
 */
export class FellohClient {
  /** Manage organisations. */
  readonly organisations: OrganisationsResource;
  /** Create, list, update, and delete bookings. */
  readonly bookings: BookingsResource;
  /** Add and remove components on bookings. */
  readonly bookingComponents: BookingComponentsResource;
  /** List, view, refund, complete, reverse, and re-assign transactions. */
  readonly transactions: TransactionsResource;
  /** List and create customers. */
  readonly customers: CustomersResource;
  /** Create, list, and manage payment links. */
  readonly paymentLinks: PaymentLinksResource;
  /** Create, list, and manage ecommerce sessions. */
  readonly ecommerce: EcommerceResource;
  /** List, authorise, and decline refunds. */
  readonly refunds: RefundsResource;
  /** List transaction charges. */
  readonly charges: ChargesResource;
  /** List chargebacks. */
  readonly chargebacks: ChargebacksResource;
  /** List and view credit notes. */
  readonly creditNotes: CreditNotesResource;
  /** List and create suppliers. */
  readonly suppliers: SuppliersResource;
  /** List, create, and activate beneficiaries. */
  readonly beneficiaries: BeneficiariesResource;
  /** List and view disbursements. */
  readonly disbursements: DisbursementsResource;
  /** List ledger entries (managed trust accounts only). */
  readonly ledger: LedgerResource;
  /** List and view acquirer settlement batches. */
  readonly batches: BatchesResource;
  /** List, create, and delete API keys. */
  readonly apiKeys: ApiKeysResource;
  /** List audit events. */
  readonly audit: AuditResource;
  /** Fetch bank accounts, transactions, and statistics via AISP. */
  readonly aisp: AispResource;
  /** Manage scheduled (MOTO) payments and approval links. */
  readonly scheduledPayments: ScheduledPaymentsResource;
  /** Fetch available enum values (currencies, statuses, etc.). */
  readonly enums: EnumsResource;

  /** Create a new Felloh API client. */
  constructor(config: FellohConfig) {
    const tokenManager = new TokenManager(config);
    const http = new HttpClient(tokenManager, config);

    this.organisations = new OrganisationsResource(http);
    this.bookings = new BookingsResource(http);
    this.bookingComponents = new BookingComponentsResource(http);
    this.transactions = new TransactionsResource(http);
    this.customers = new CustomersResource(http);
    this.paymentLinks = new PaymentLinksResource(http);
    this.ecommerce = new EcommerceResource(http);
    this.refunds = new RefundsResource(http);
    this.charges = new ChargesResource(http);
    this.chargebacks = new ChargebacksResource(http);
    this.creditNotes = new CreditNotesResource(http);
    this.suppliers = new SuppliersResource(http);
    this.beneficiaries = new BeneficiariesResource(http);
    this.disbursements = new DisbursementsResource(http);
    this.ledger = new LedgerResource(http);
    this.batches = new BatchesResource(http);
    this.apiKeys = new ApiKeysResource(http);
    this.audit = new AuditResource(http);
    this.aisp = new AispResource(http);
    this.scheduledPayments = new ScheduledPaymentsResource(http);
    this.enums = new EnumsResource(http);
  }
}
