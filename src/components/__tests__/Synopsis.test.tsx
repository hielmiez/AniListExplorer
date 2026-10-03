import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Synopsis from '../Synopsis';

describe('Synopsis', () => {
  beforeEach(() => {
    // Mock scrollHeight getter to control overflow detection
    Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
      configurable: true,
      get: function() {
        return this.textContent && this.textContent.length > 50 ? 200 : 100;
      }
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders default text when no synopsis is provided', () => {
    render(<Synopsis text="" />);
    expect(screen.getByText('No synopsis available.')).toBeInTheDocument();
  });

  it('renders provided HTML text safely', () => {
    render(<Synopsis text="<p>Custom <strong>synopsis</strong></p>" />);
    const innerText = screen.getByText('synopsis');
    const wrapper = innerText.closest('div');
    expect(wrapper).toHaveClass('max-h-[160px]');
  });

  it('shows read more button when content overflows', () => {
    const longText = 'A'.repeat(200);
    render(<Synopsis text={longText} />);
    
    const readMoreBtn = screen.getByRole('button', { name: /read more/i });
    expect(readMoreBtn).toBeInTheDocument();
    
    // Check toggle behavior
    fireEvent.click(readMoreBtn);
    expect(screen.getByRole('button', { name: /read less/i })).toBeInTheDocument();
  });

  it('does not show read more button for short content', () => {
    render(<Synopsis text="Short text" />);
    expect(screen.queryByRole('button', { name: /read more/i })).not.toBeInTheDocument();
  });
});
