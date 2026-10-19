import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Spinner from './Spinner';
import QuoteResult from './QuoteResult';

describe('Spinner', () => {
  it('shows the default loading label with role status', () => {
    render(<Spinner />);
    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('Getting your quote...');
  });

  it('shows a custom label when one is given', () => {
    render(<Spinner label="Please wait" />);
    expect(screen.getByRole('status')).toHaveTextContent('Please wait');
  });

  it('appears while a quote request is pending', () => {
    render(<QuoteResult status="pending" quote={null} />);
    expect(screen.getByRole('status')).toHaveTextContent('Getting your quote...');
    expect(screen.queryByRole('article')).not.toBeInTheDocument();
  });
});