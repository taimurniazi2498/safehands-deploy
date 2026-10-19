import styles from './Spinner.module.css';

export default function Spinner({ label = 'Getting your quote...'}) {
  return (
    <div className={styles.loading} role='status'>
      <span className={styles.spinner} aria-hidden='true' />
      <span>{label}</span>
    </div>
  );
}