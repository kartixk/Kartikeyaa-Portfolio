'use client';

import { useEffect, useState } from 'react';

const fmt = () =>
  new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date());

/** Live local time in Visakhapatnam (renders after mount to avoid hydration drift). */
const LocalTime = ({ className }: { className?: string }) => {
  const [t, setT] = useState('');
  useEffect(() => {
    setT(fmt());
    const id = window.setInterval(() => setT(fmt()), 15000);
    return () => window.clearInterval(id);
  }, []);
  return <span className={className}>{t ? `${t} IST` : ' '}</span>;
};

export default LocalTime;
