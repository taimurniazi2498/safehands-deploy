import Spinner from './Spinner';
import ErrorBanner from './ErrorBanner';
import styles from './QuoteResult.module.css';

const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

function estimatePremium(quote) {
  const base = { auto: 900, health: 1200, home: 700, life: 600};
  const type = String(quote.insuranceType ?? '').toLowerCase();
  return (base[type] ?? 1000) + (String(quote.name ?? '').length + String(quote.email ?? '').length) * 7;
}

export default function QuoteResult({ status, quote, error, onRetry }) {
  if (status === 'idle') return null;

  return (
    <section className={styles.wrapper} aria-live='polite'>
      {status === 'pending' && <Spinner />}

      {status === 'error' && <ErrorBanner message={error} onRetry={onRetry} />}

      {status === 'success' && quote && (
        <article className={styles.card} aria-label='Your insurance quote'>
          <h3>Quote for {quote.name}</h3>
          <p className={styles.amount}>
            Your estimated premium: {money.format(estimatePremium(quote))}
          </p>
          <dl>
            <dt>Insurance type</dt>
            <dd>{quote.insuranceType}</dd>
            <dt>Coverage amount</dt>
            <dd>{money.format(estimatePremium(quote) *200)}</dd>
            <dt>Deductible</dt>
            <dd>{money.format(500)}</dd>
          </dl>
          <ul>
            <li>Accidental damage and theft</li>
            <li>24/7 claims support</li>
            <li>Free policy changes within 14 days</li>
          </ul>
          <small>Quote ID: {quote.quoteId}</small>
        </article>
      )}
    </section>
  );
}