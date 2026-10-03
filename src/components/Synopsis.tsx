'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function Synopsis({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      // 160px is the max-height we set for the collapsed state
      setIsOverflowing(contentRef.current.scrollHeight > 160);
    }
  }, [text]);

  return (
    <div className="bg-slate-900/60 rounded-xl p-5 md:p-8 border border-slate-800 mb-10">
      <h3 className="text-xl font-bold mb-4 text-slate-100">Synopsis</h3>
      <div 
        className="relative transition-all duration-300"
      >
        <div 
          ref={contentRef}
          className={`text-slate-300 leading-relaxed prose prose-invert max-w-none prose-p:mb-4 prose-a:text-blue-400 hover:prose-a:text-blue-300 ${!expanded ? 'max-h-[160px] overflow-hidden' : ''}`}
          dangerouslySetInnerHTML={{ __html: text || 'No synopsis available.' }}
        />
        {!expanded && isOverflowing && (
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent pointer-events-none" />
        )}
      </div>
      
      {isOverflowing && (
        <button 
          onClick={() => setExpanded(!expanded)}
          className="mt-2 flex items-center gap-1 text-sm font-medium text-slate-300 hover:text-white transition-colors"
        >
          {expanded ? (
            <>Read Less <ChevronUp size={16} /></>
          ) : (
            <>Read More <ChevronDown size={16} /></>
          )}
        </button>
      )}
    </div>
  );
}
