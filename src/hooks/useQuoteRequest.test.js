import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';

vi.mock('../api/quotesApi', () => ({ fetchQuote: vi.fn() }));

import { fetchQuote } from '../api/quotesApi';
import { useQuoteRequest } from './useQuoteRequest';

const values = {
  name: 'Ali Khan',
  email: 'ali@example.com',
  phone: '+923001234567',
  insuranceType: 'health',
};
const quote = { quoteId: 'SH-101', ...values };

beforeEach(() => {
  fetchQuote.mockReset();
});

describe('useQuoteRequest', () => {
  it('starts in the idle state', () => {
    const { result } = renderHook(() => useQuoteRequest());
    expect(result.current.status).toBe('idle');
    expect(result.current.quote).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('moves to success and stores the quote', async () => {
    fetchQuote.mockResolvedValue(quote);
    const { result } = renderHook(() => useQuoteRequest());

    await act(async () => {
      await result.current.submit(values);
    });

    expect(result.current.status).toBe('success');
    expect(result.current.quote).toEqual(quote);
    expect(result.current.error).toBeNull();
  });

  it('moves to error with a friendly message when the request fails', async () => {
    fetchQuote.mockRejectedValue(new Error('boom'));
    const { result } = renderHook(() => useQuoteRequest());

    await act(async () => {
      await result.current.submit(values);
    });

    expect(result.current.status).toBe('error');
    expect(result.current.quote).toBeNull();
    expect(result.current.error).toBe(
      'We could not get your quote right now. Please try again.',
    );
  });

  it('retry sends the last submitted values again', async () => {
    fetchQuote.mockRejectedValueOnce(new Error('boom'));
    fetchQuote.mockResolvedValueOnce(quote);
    const { result } = renderHook(() => useQuoteRequest());

    await act(async () => {
      await result.current.submit(values);
    });
    expect(result.current.status).toBe('error');

    act(() => {
      result.current.retry();
    });

    await waitFor(() => expect(result.current.status).toBe('success'));
    expect(fetchQuote).toHaveBeenCalledTimes(2);
    expect(fetchQuote.mock.calls[1][0]).toEqual(values);
    expect(result.current.quote).toEqual(quote);
  });

  it('retry does nothing before any submit', () => {
    const { result } = renderHook(() => useQuoteRequest());

    act(() => {
      result.current.retry();
    });

    expect(fetchQuote).not.toHaveBeenCalled();
    expect(result.current.status).toBe('idle');
  });

  it('ignores an aborted request and does not show an error', async () => {
    const abortError = new Error('aborted');
    abortError.name = 'AbortError';
    fetchQuote.mockRejectedValue(abortError);
    const { result } = renderHook(() => useQuoteRequest());

    await act(async () => {
      await result.current.submit(values);
    });

    expect(result.current.status).toBe('pending');
    expect(result.current.error).toBeNull();
  });

  it('aborts the in-flight request when the component unmounts', () => {
    fetchQuote.mockReturnValue(new Promise(() => {}));
    const { result, unmount } = renderHook(() => useQuoteRequest());

    act(() => {
      result.current.submit(values);
    });
    expect(result.current.status).toBe('pending');

    const { signal } = fetchQuote.mock.calls[0][1];
    expect(signal.aborted).toBe(false);
    unmount();
    expect(signal.aborted).toBe(true);
  });
});