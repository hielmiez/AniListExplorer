import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SortAndToolBar from '../SortAndToolBar';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
  usePathname: jest.fn(),
}));

describe('SortAndToolBar', () => {
  const mockPush = jest.fn();
  let mockSearchParams = new URLSearchParams();

  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchParams = new URLSearchParams();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useSearchParams as jest.Mock).mockImplementation(() => mockSearchParams);
    (usePathname as jest.Mock).mockReturnValue('/explore');
  });

  it('renders correctly with default values', () => {
    render(<SortAndToolBar />);
    expect(screen.getByLabelText('Grid View')).toBeInTheDocument();
    expect(screen.getByLabelText('List View')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveValue('POPULARITY_DESC');
  });

  it('toggles view to list and pushes to router', () => {
    render(<SortAndToolBar />);
    const listBtn = screen.getByLabelText('List View');
    fireEvent.click(listBtn);
    expect(mockPush).toHaveBeenCalledWith('/explore?view=list');
  });

  it('changes sort value and pushes to router', () => {
    render(<SortAndToolBar />);
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'TRENDING_DESC' } });
    expect(mockPush).toHaveBeenCalledWith('/explore?sort=TRENDING_DESC');
  });
});
