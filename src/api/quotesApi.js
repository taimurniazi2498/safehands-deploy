const ENDPOINT = 'https://jsonplaceholder.typicode.com/posts';
export async function fetchQuote(values, { signal } = {}) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    body: JSON.stringify(values),
    signal,
  });

  if (!res.ok) {
    throw new Error(`Quote service failed (status ${res.status})`);
  }

  const created = await res.json();
  return { quoteId: `SH-${created.id}`, ...values };
}