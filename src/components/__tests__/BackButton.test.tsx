import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BackButton from '../BackButton';
import { useRouter } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('BackButton', () => {
  const mockBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      back: mockBack,
    });
  });

  it('renders the back button correctly', () => {
    render(<BackButton />);
    
    const button = screen.getByRole('button', { name: /back/i });
    expect(button).toBeInTheDocument();
    // Default className should include the mb-8 fallback if omitted, or standard classes
    expect(button).toHaveClass('bg-slate-800/80');
  });

  it('calls router.back() when clicked', () => {
    render(<BackButton />);
    
    const button = screen.getByRole('button', { name: /back/i });
    fireEvent.click(button);
    
    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it('applies custom className if provided', () => {
    render(<BackButton className="my-custom-class" />);
    
    const button = screen.getByRole('button', { name: /back/i });
    expect(button).toHaveClass('my-custom-class');
  });
});
