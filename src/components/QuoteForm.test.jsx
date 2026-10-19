import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const { submitMock } = vi.hoisted(() => ({ submitMock: vi.fn() }));

vi.mock('../hooks/useQuoteRequest', () => ({
  useQuoteRequest: () => ({
    status: 'idle',
    quote: null,
    error: null,
    submit: submitMock,
    retry: vi.fn(),
  }),
}));

import QuoteForm from './QuoteForm';

describe('QuoteForm', () => {
  beforeEach(() => {
    submitMock.mockClear();
  });

  it('renders all four fields and the submit button', () => {
    render(<QuoteForm />);
    expect(screen.getByLabelText('Full name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Phone')).toBeInTheDocument();
    expect(screen.getByLabelText('Insurance type')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Get my quote' })).toBeInTheDocument();
  });

  it('shows errors and focuses the first invalid field on empty submit', async () => {
    const user = userEvent.setup();
    render(<QuoteForm />);
    await user.click(screen.getByRole('button', { name: 'Get my quote' }));

    expect(screen.getByText('Full name is required.')).toBeInTheDocument();
    expect(screen.getByText('Email is required.')).toBeInTheDocument();
    expect(screen.getByText('Phone number is required.')).toBeInTheDocument();
    expect(screen.getByText('Please choose an insurance type.')).toBeInTheDocument();
    expect(screen.getByLabelText('Full name')).toHaveFocus();
    expect(submitMock).not.toHaveBeenCalled();
  });

  it('shows a live error for an invalid email', async () => {
    const user = userEvent.setup();
    render(<QuoteForm />);
    const email = screen.getByLabelText('Email');
    await user.type(email, 'abc');

    expect(screen.getByText('Enter a valid email, like name@example.com.')).toBeInTheDocument();
    expect(email).toHaveAttribute('aria-invalid', 'true');
  });

  it('shows a live error for an invalid phone number', async () => {
    const user = userEvent.setup();
    render(<QuoteForm />);
    await user.type(screen.getByLabelText('Phone'), '123');

    expect(screen.getByText('Enter a valid phone number (10 to 15 digits).')).toBeInTheDocument();
  });

  it('shows an error for a too-short name', async () => {
    const user = userEvent.setup();
    render(<QuoteForm />);
    await user.type(screen.getByLabelText('Full name'), 'A');

    expect(screen.getByText('Name must be at least 2 characters.')).toBeInTheDocument();
  });

  it('submits valid values', async () => {
    const user = userEvent.setup();
    render(<QuoteForm />);

    await user.type(screen.getByLabelText('Full name'), 'Ali Khan');
    await user.type(screen.getByLabelText('Email'), 'ali@example.com');
    await user.type(screen.getByLabelText('Phone'), '+923001234567');
    await user.selectOptions(screen.getByLabelText('Insurance type'), 'health');
    await user.click(screen.getByRole('button', { name: 'Get my quote' }));

    expect(submitMock).toHaveBeenCalledTimes(1);
    expect(submitMock).toHaveBeenCalledWith({
      name: 'Ali Khan',
      email: 'ali@example.com',
      phone: '+923001234567',
      insuranceType: 'health',
    });
  });
});