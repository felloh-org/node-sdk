export interface ResponseMeta {
  code: number;
  reason: string;
  message: string;
  request_id: string;
  count?: number;
}

export interface FellohResponse<T> {
  data: T;
  errors: FellohApiError[];
  meta: ResponseMeta;
}

export type FellohListResponse<T> = FellohResponse<T[]>;

export interface FellohApiError {
  title: string;
  message: string;
  documentation_url: string;
  type: string;
  code: string;
}

export interface PaginationParams {
  skip?: number;
  take?: number;
}

export interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  body?: object;
  query?: Record<string, string>;
}
