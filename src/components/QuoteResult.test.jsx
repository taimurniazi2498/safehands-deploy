import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import QuoteResult from './QuoteResult';

const quote = {
  quoteId: 'SH-101',
  name: 'Ali Khan',
  email: 'ali@example.com',
  phone: '+923001234567',
  insuranceType: 'health',
};

describe('QuoteResult', () => {
  it('renders nothing when idle', () => {
    const { container } = render(<QuoteResult status="idle" quote={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('shows the quote card with amount and coverage details on success', () => {
    render(<QuoteResult status="success" quote={quote} />);

    expect(screen.getByRole('article', { name: 'Your insurance quote' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Quote for Ali Khan' })).toBeInTheDocument();
    expect(screen.getByText('Your estimated premium: $1,361')).toBeInTheDocument();
    expect(screen.getByText('health')).toBeInTheDocument();
    expect(screen.getByText('$272,200')).toBeInTheDocument();
    expect(screen.getByText('$500')).toBeInTheDocument();
    expect(screen.getByText('Quote ID: SH-101')).toBeInTheDocument();
  });

  it('uses a default base premium for an unknown insurance type', () => {
    render(<QuoteResult status="success" quote={{ ...quote, insuranceType: 'pet' }} />);
    expect(screen.getByText('Your estimated premium: $1,161')).toBeInTheDocument();
  });

  it('does not render the card when success has no quote', () => {
    render(<QuoteResult status="success" quote={null} />);
    expect(screen.queryByRole('article')).not.toBeInTheDocument();
  });
});