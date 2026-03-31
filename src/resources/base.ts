import type { HttpClient } from '../http.js';
import type { FellohResponse, FellohListResponse } from '../types/common.js';
import { Paginator } from '../pagination.js';

export abstract class BaseResource {
  constructor(protected http: HttpClient) {}

  protected _list<T>(path: string, params: object): Promise<FellohListResponse<T>> {
    return this.http.request<T[]>({ method: 'POST', path, body: params });
  }

  protected _get<T>(path: string): Promise<FellohResponse<T>> {
    return this.http.request<T>({ method: 'GET', path });
  }

  protected _getWithQuery<T>(path: string, query: Record<string, string>): Promise<FellohResponse<T>> {
    return this.http.request<T>({ method: 'GET', path, query });
  }

  protected _create<T>(path: string, body: object): Promise<FellohResponse<T>> {
    return this.http.request<T>({ method: 'PUT', path, body });
  }

  protected _update<T>(path: string, body: object): Promise<FellohResponse<T>> {
    return this.http.request<T>({ method: 'POST', path, body });
  }

  protected _remove<T>(path: string): Promise<FellohResponse<T>> {
    return this.http.request<T>({ method: 'DELETE', path });
  }

  protected _paginate<T>(path: string, params: object): AsyncIterable<T> {
    return new Paginator<T>(this.http, path, params);
  }
}
