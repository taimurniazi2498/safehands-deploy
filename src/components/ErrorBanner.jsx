import styles from './ErrorBanner.module.css';

export default function ErrorBanner({ message, onRetry }) {
  return (
    <div className={styles.banner} role='alert'>
      <p>{message}</p>
      <button type='button' onClick={onRetry}>
        Try again
      </button>
    </div>
  );
}