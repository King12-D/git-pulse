"use client";

import React, { useState, useEffect } from 'react';
import { getRelativeTime } from '@/lib/utils';

export default function TimeDisplay({ time }: { time: string | Date | number | null | undefined }) {
  const [display, setDisplay] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (!time) return;
    
    setIsMounted(true);
    setDisplay(getRelativeTime(time));
    
    const interval = setInterval(() => {
      setDisplay(getRelativeTime(time));
    }, 30000); // 30 seconds update interval
    
    return () => clearInterval(interval);
  }, [time]);

  if (!time) return null;

  if (!isMounted) {
    // Initial pre-hydration pass reduces text mismatch
    return <span suppressHydrationWarning>{getRelativeTime(time)}</span>;
  }

  return <span>{display}</span>;
}
