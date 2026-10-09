'use client';

import { createContext, useContext } from 'react';

/** True once the intro preloader has lifted — hero animations wait for it. */
const ReadyContext = createContext(true);

export const ReadyProvider = ReadyContext.Provider;
export const useReady = () => useContext(ReadyContext);
