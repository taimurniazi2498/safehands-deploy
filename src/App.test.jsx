import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import ThemeProvider from './context/ThemeProvider';
import App from './App';

function renderApp(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </MemoryRouter>,
  );
}

describe('App routing', () => {
  it('shows the Home page at /', async () => {
    renderApp('/');
    expect(
      await screen.findByRole('heading', { name: /welcome to safehands/i }),
    ).toBeInTheDocument();
  });

  it('shows the About page at /about', async () => {
    renderApp('/about');
    expect(
      await screen.findByRole('heading', { name: 'About SafeHands' }),
    ).toBeInTheDocument();
  });

  it('shows the Quote page at /quote', async () => {
    renderApp('/quote');
    expect(
      await screen.findByRole('heading', { name: 'Get a Quote' }),
    ).toBeInTheDocument();
  });

  it('navigates between pages using the NavBar links', async () => {
    const user = userEvent.setup();
    renderApp('/');

    await user.click(screen.getByRole('link', { name: 'About' }));
    expect(
      await screen.findByRole('heading', { name: 'About SafeHands' }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: 'Quote' }));
    expect(
      await screen.findByRole('heading', { name: 'Get a Quote' }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: 'Home' }));
    expect(
      await screen.findByRole('heading', { name: /welcome to safehands/i }),
    ).toBeInTheDocument();
  });
});