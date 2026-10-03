import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Filters from '../Filters';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
  usePathname: jest.fn(),
}));

describe('Filters', () => {
  const mockPush = jest.fn();
  const mockSearchParams = new URLSearchParams();
  
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
    (usePathname as jest.Mock).mockReturnValue('/explore');
  });

  it('renders correctly with given genres and tags', () => {
    render(<Filters genres={['Action', 'Comedy']} tags={['Magic', 'Mecha']} />);
    
    // Check Search input
    expect(screen.getByPlaceholderText('Search for anime...')).toBeInTheDocument();
    
    // Check Genre select
    expect(screen.getByRole('combobox', { name: /genre/i })).toBeInTheDocument();
    
    // Check Clear filters button
    expect(screen.getByRole('button', { name: /clear filters/i })).toBeInTheDocument();
  });

  it('submits a search query and pushes to router', () => {
    render(<Filters genres={[]} tags={[]} />);
    
    const input = screen.getByPlaceholderText('Search for anime...');
    fireEvent.change(input, { target: { value: 'Naruto' } });
    
    const searchButton = screen.getByRole('button', { name: /^search$/i });
    fireEvent.click(searchButton);
    
    expect(mockPush).toHaveBeenCalledWith('/explore?search=Naruto');
  });

  it('clears filters when clear button is clicked', () => {
    render(<Filters genres={[]} tags={[]} />);
    
    const clearButton = screen.getByRole('button', { name: /clear filters/i });
    fireEvent.click(clearButton);
    
    // Should clear the search and route back to the base pathname without query params
    expect(mockPush).toHaveBeenCalledWith('/explore');
  });
});
