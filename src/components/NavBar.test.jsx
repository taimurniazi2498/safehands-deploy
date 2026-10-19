import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import ThemeProvider from '../context/ThemeProvider';
import NavBar from './NavBar';

function renderNavBar() {
  return render(
    <MemoryRouter>
      <ThemeProvider>
        <NavBar />
      </ThemeProvider>
    </MemoryRouter>,
  );
}

describe('NavBar', () => {
  it('shows links to Home, About and Quote', () => {
    renderNavBar();
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about');
    expect(screen.getByRole('link', { name: 'Quote' })).toHaveAttribute('href', '/quote');
  });

   it('opens and closes the mobile menu', async () => {
    const user = userEvent.setup();
    renderNavBar();
    const menuButton = screen.getByLabelText('Toggle menu');
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    await user.click(menuButton);
    expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    await user.click(menuButton);
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('switches theme and saves it in localStorage', async () => {
    const user = userEvent.setup();
    renderNavBar();
    await user.click(screen.getByRole('button', { name: 'Switch to dark mode' }));
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    expect(localStorage.getItem('theme')).toBe('dark');
    expect(screen.getByRole('button', { name: 'Switch to light mode' })).toBeInTheDocument();
  });
});