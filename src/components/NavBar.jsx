import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../context/useTheme';
import styles from './NavBar.module.css';

function SunIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function NavBar() {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const linkClass = ({ isActive }) =>
    isActive ? `${styles.link} ${styles.active}` : styles.link;

  return (
    <nav className={styles.nav}>
      <span className={styles.brand}>SafeHands</span>

      <button
        className={styles.hamburger}
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
        aria-expanded={open}
      >
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
      </button>

      <ul className={`${styles.links} ${open ? styles.open : ''}`}>
        <li>
          <NavLink to="/" end className={linkClass} onClick={() => setOpen(false)}>Home</NavLink>
        </li>
        <li>
          <NavLink to="/about" className={linkClass} onClick={() => setOpen(false)}>About</NavLink>
        </li>
        <li>
          <NavLink to="/quote" className={linkClass} onClick={() => setOpen(false)}>Quote</NavLink>
        </li>
      </ul>

      <button
        type="button"
        className={styles.themeToggle}
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
      </button>
    </nav>
  );
}

export default NavBar;