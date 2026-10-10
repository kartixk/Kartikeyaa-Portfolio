'use client';

import { useState } from 'react';
import { ArrowUp, MessageCircle } from 'lucide-react';
import { useRouteTransition } from '@/components/RouteTransition';
import { cn } from '@/lib/utils';

/** "Message me…" pill. Submitting carries the text over to the Contact form (pre-filled). */
export const MessageBar = ({ className }: { className?: string }) => {
  const { go } = useRouteTransition();
  const [text, setText] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const t = text.trim();
    go(t ? `/contact?message=${encodeURIComponent(t.slice(0, 1000))}` : '/contact');
  };

  return (
    <form
      onSubmit={submit}
      className={cn(
        'group flex items-center gap-3 rounded-full border border-line/15 bg-card/80 py-2 pl-5 pr-2 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)] backdrop-blur-md transition-colors focus-within:border-lime/60',
        className
      )}
    >
      <MessageCircle size={18} className="shrink-0 text-muted-foreground" aria-hidden />
      <label htmlFor="desk-message" className="sr-only">
        Send me a message
      </label>
      <input
        id="desk-message"
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={1000}
        autoComplete="off"
        placeholder="Message me…"
        className="min-w-0 flex-1 bg-transparent py-2 font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground"
      />
      <button
        type="submit"
        aria-label="Continue to the contact form"
        className={cn(
          'grid h-10 w-10 shrink-0 place-items-center rounded-full transition-all duration-300',
          text.trim() ? 'bg-lime text-[#0c0f0a]' : 'bg-line/10 text-muted-foreground hover:bg-line/20'
        )}
      >
        <ArrowUp size={17} />
      </button>
    </form>
  );
};

export default MessageBar;
