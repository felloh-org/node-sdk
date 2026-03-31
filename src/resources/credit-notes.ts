import { BaseResource } from './base.js';
import type { FellohResponse, FellohListResponse } from '../types/common.js';
import type { CreditNote, CreateCreditNoteParams, AssignCreditNoteParams, ListCreditNotesParams } from '../types/credit-notes.js';

export class CreditNotesResource extends BaseResource {
  /** Fetch a paginated list of credit notes. */
  async list(params: ListCreditNotesParams): Promise<FellohListResponse<CreditNote>> {
    return this._list<CreditNote>('/agent/credit-notes', params);
  }

  /** Auto-paginate through all credit notes. Returns an `AsyncIterable`. */
  listAll(params: Omit<ListCreditNotesParams, 'skip' | 'take'>): AsyncIterable<CreditNote> {
    return this._paginate<CreditNote>('/agent/credit-notes', params);
  }

  /** Fetch a single credit note by ID. */
  async get(creditNoteId: string): Promise<FellohResponse<CreditNote>> {
    return this._get<CreditNote>(`/agent/credit-notes/${creditNoteId}`);
  }

  /** Create a new credit note. Amount must be in the lowest currency denomination (e.g. pence). */
  async create(params: CreateCreditNoteParams): Promise<FellohResponse<CreditNote>> {
    return this._create<CreditNote>('/agent/credit-notes', params);
  }

  /** Assign a credit note to a booking (creates a new booking if needed). */
  async assign(creditNoteId: string, params: AssignCreditNoteParams): Promise<FellohResponse<void>> {
    return this._update<void>(`/agent/credit-notes/${creditNoteId}/assign`, params);
  }
}
