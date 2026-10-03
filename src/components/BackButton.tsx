'use client';

import { useRouter } from 'next/navigation';

export default function BackButton({ className = "mb-8" }: { className?: string }) {
  const router = useRouter();
  
  return (
    <button 
      onClick={() => router.back()} 
      className={`inline-block px-4 py-2 bg-slate-800/80 hover:bg-slate-700 backdrop-blur-md rounded-lg font-medium text-sm transition-colors border border-slate-700/50 ${className}`}
    >
      &larr; Back
    </button>
  );
}
