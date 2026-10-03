import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UserMenu from '../UserMenu';
import { useAuth } from '@/contexts/AuthContext';

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('UserMenu', () => {
  const mockLogin = jest.fn();
  const mockLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login button when user is logged out', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      login: mockLogin,
      logout: mockLogout,
    });

    render(<UserMenu />);
    
    const loginBtn = screen.getByRole('button', { name: /login with anilist/i });
    expect(loginBtn).toBeInTheDocument();
    
    fireEvent.click(loginBtn);
    expect(mockLogin).toHaveBeenCalledTimes(1);
  });

  it('renders user information and watchlist link when logged in', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { name: 'TestUser', avatar: { large: '/avatar.jpg' } },
      login: mockLogin,
      logout: mockLogout,
    });

    render(<UserMenu />);
    
    expect(screen.getByText('TestUser')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /watchlist/i })).toBeInTheDocument();
    
    // Check logout behavior
    const logoutBtn = screen.getByRole('button', { name: /log out/i });
    fireEvent.click(logoutBtn);
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
