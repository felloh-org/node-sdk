import type { HttpClient } from './http.js';

export class Paginator<T> implements AsyncIterable<T> {
  constructor(
    private http: HttpClient,
    private path: string,
    private params: object,
  ) {}

  async *[Symbol.asyncIterator](): AsyncIterator<T> {
    let skip = 0;
    const take = 25;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const response = await this.http.request<T[]>({
        method: 'POST',
        path: this.path,
        body: { ...this.params, skip, take },
      });

      const items = response.data;
      const totalCount = response.meta.count ?? 0;

      for (const item of items) {
        yield item;
      }

      skip += items.length;

      if (items.length < take || skip >= totalCount) break;
    }
  }
}

/**
 * Collect all items from an `AsyncIterable` into an array.
 * Useful with `listAll()` when you need the full result set in memory.
 *
 * @example
 * ```typescript
 * const allBookings = await toArray(client.bookings.listAll({ organisation: 'org-id' }));
 * ```
 */
export async function toArray<T>(iterable: AsyncIterable<T>): Promise<T[]> {
  const items: T[] = [];
  for await (const item of iterable) items.push(item);
  return items;
}
