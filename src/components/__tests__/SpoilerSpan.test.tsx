import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SpoilerSpan from '../SpoilerSpan';

describe('SpoilerSpan', () => {
  it('renders children with markdown_spoiler class but without revealed class initially', () => {
    render(<SpoilerSpan>Secret Text</SpoilerSpan>);

    const span = screen.getByText('Secret Text');
    expect(span).toBeInTheDocument();
    expect(span).toHaveClass('markdown_spoiler');
    expect(span).not.toHaveClass('revealed');
  });

  it('toggles the revealed class when clicked', () => {
    render(<SpoilerSpan>Secret Text</SpoilerSpan>);

    const span = screen.getByText('Secret Text');
    
    // First click -> should reveal
    fireEvent.click(span);
    expect(span).toHaveClass('revealed');

    // Second click -> should hide
    fireEvent.click(span);
    expect(span).not.toHaveClass('revealed');
  });

  it('accepts additional classNames', () => {
    render(<SpoilerSpan className="custom-test-class">Secret Text</SpoilerSpan>);
    
    const span = screen.getByText('Secret Text');
    expect(span).toHaveClass('custom-test-class');
    expect(span).toHaveClass('markdown_spoiler');
  });
});
