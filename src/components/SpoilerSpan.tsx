'use client';

import { useState } from 'react';

export default function SpoilerSpan({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const [revealed, setRevealed] = useState(false);
  
  return (
    <span 
      className={`markdown_spoiler ${revealed ? 'revealed' : ''} ${className}`}
      onClick={(e) => {
        e.preventDefault();
        setRevealed(!revealed);
      }}
    >
      {children}
    </span>
  );
}
