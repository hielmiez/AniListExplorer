'use client';

import { useEffect, useRef } from 'react';

export default function Biography({ html }: { html: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleSpoilerClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const spoiler = target.closest('.markdown_spoiler');
      if (spoiler) {
        spoiler.classList.toggle('revealed');
      }
    };

    container.addEventListener('click', handleSpoilerClick);
    return () => container.removeEventListener('click', handleSpoilerClick);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="text-slate-300 leading-relaxed prose prose-invert max-w-none prose-p:mb-4 prose-a:text-blue-400 hover:prose-a:text-blue-300"
      dangerouslySetInnerHTML={{ __html: html || 'No biography available.' }}
    />
  );
}
