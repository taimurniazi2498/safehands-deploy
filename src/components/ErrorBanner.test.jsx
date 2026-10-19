import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorBanner from './ErrorBanner';
import QuoteResult from './QuoteResult';

describe('ErrorBanner', () => {
  it('shows the error message with role alert', () => {
    render(<ErrorBanner message="Something went wrong." onRetry={() => {}} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong.');
  });

  it('calls onRetry when the Try again button is clicked', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<ErrorBanner message="Something went wrong." onRetry={onRetry} />);

    await user.click(screen.getByRole('button', { name: 'Try again' }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('appears inside QuoteResult when the request fails, and retry works', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(
      <QuoteResult
        status="error"
        quote={null}
        error="We could not get your quote right now. Please try again."
        onRetry={onRetry}
      />,
    );

    expect(screen.getByRole('alert')).toHaveTextContent(
      'We could not get your quote right now. Please try again.',
    );
    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});