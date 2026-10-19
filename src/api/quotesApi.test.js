import { describe, it, expect, vi, afterEach } from 'vitest';
import { fetchQuote } from './quotesApi';

const values = {
  name: 'Ali Khan',
  email: 'ali@example.com',
  phone: '+923001234567',
  insuranceType: 'health',
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('fetchQuote', () => {
  it('posts the form values and returns a quote with an id', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 101 }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await fetchQuote(values);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe('https://jsonplaceholder.typicode.com/posts');
    expect(options.method).toBe('POST');
    expect(JSON.parse(options.body)).toEqual(values);
    expect(result).toEqual({ quoteId: 'SH-101', ...values });
  });

  it('passes the abort signal to fetch', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 1 }),
    });
    vi.stubGlobal('fetch', fetchMock);
    const controller = new AbortController();

    await fetchQuote(values, { signal: controller.signal });

    expect(fetchMock.mock.calls[0][1].signal).toBe(controller.signal);
  });

  it('throws an error when the server responds with a failure status', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 500 }),
    );

    await expect(fetchQuote(values)).rejects.toThrow(
      'Quote service failed (status 500)',
    );
  });

  it('throws when the network is unavailable', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));

    await expect(fetchQuote(values)).rejects.toThrow('Failed to fetch');
  });
});