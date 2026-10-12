'use client';

import { useSyncExternalStore } from 'react';

/** SSR-safe media-query hook (false on the server and during hydration, then live). */
export const useMedia = (query: string) =>
  useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(query);
      m.addEventListener('change', cb);
      return () => m.removeEventListener('change', cb);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
