import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Date from '../../components/date';

describe('Date component', () => {
  it('renders a formatted date from an ISO string', () => {
    render(<Date dateString="2025-06-15" />);
    expect(screen.getByText('June 15, 2025')).toBeInTheDocument();
  });

  it('renders the correct datetime attribute', () => {
    render(<Date dateString="2025-01-01" />);
    const timeEl = screen.getByText('January 1, 2025');
    expect(timeEl).toHaveAttribute('datetime', '2025-01-01');
  });

  it('formats various dates correctly', () => {
    const { unmount } = render(<Date dateString="2022-12-25" />);
    expect(screen.getByText('December 25, 2022')).toBeInTheDocument();
    unmount();

    render(<Date dateString="2020-02-29" />);
    expect(screen.getByText('February 29, 2020')).toBeInTheDocument();
  });

  it('renders inside a <time> element', () => {
    const { container } = render(<Date dateString="2025-03-10" />);
    const timeEl = container.querySelector('time');
    expect(timeEl).not.toBeNull();
    expect(timeEl.textContent).toBe('March 10, 2025');
  });
});
