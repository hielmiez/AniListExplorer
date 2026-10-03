'use client';

import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import { LogIn, LogOut, Bookmark } from 'lucide-react';

export default function UserMenu() {
  const { user, login, logout } = useAuth();

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <Link href="/watchlist" className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
          <Bookmark className="w-4 h-4" />
          Watchlist
        </Link>
        <div className="flex items-center gap-3 pl-4 border-l border-slate-700">
          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-slate-800 border border-slate-600">
            {user.avatar?.large && (
              <Image src={user.avatar.large} alt={user.name} fill className="object-cover" sizes="32px" />
            )}
          </div>
          <span className="text-sm font-medium text-slate-200 hidden sm:block">{user.name}</span>
          <button 
            onClick={logout} 
            className="text-slate-400 hover:text-rose-400 transition-colors ml-2"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <button 
      onClick={login}
      className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
    >
      <LogIn className="w-4 h-4" />
      Login with AniList
    </button>
  );
}
