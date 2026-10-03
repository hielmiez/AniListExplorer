'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface User {
  id: number;
  name: string;
  avatar: {
    large: string;
  };
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const accessToken = params.get('access_token');
      if (accessToken) return accessToken;
      return localStorage.getItem('anilist_token');
    }
    return null;
  });
  const [user, setUser] = useState<User | null>(null);

  const logout = () => {
    localStorage.removeItem('anilist_token');
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const accessToken = params.get('access_token');
      
      if (accessToken) {
        localStorage.setItem('anilist_token', accessToken);
        // Clear hash to hide token from URL
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    }
  }, []);

  useEffect(() => {
    if (token) {
      // Fetch user profile
      fetch('https://graphql.anilist.co', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          query: `
            query {
              Viewer {
                id
                name
                avatar {
                  large
                }
              }
            }
          `
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.data?.Viewer) {
          setUser(data.data.Viewer);
        } else {
          // Token might be expired
          logout();
        }
      })
      .catch(console.error);
    }
  }, [token]);

  const login = () => {
    const clientId = process.env.NEXT_PUBLIC_ANILIST_CLIENT_ID;
    if (!clientId) {
      alert('NEXT_PUBLIC_ANILIST_CLIENT_ID is not configured in .env.local');
      return;
    }
    window.location.href = `https://anilist.co/api/v2/oauth/authorize?client_id=${clientId}&response_type=token`;
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
