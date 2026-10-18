import React, { useEffect, useRef, useState } from 'react';

/** Tracks elapsed seconds; pauses when `running` is false. */
export function useTimer(running: boolean, resetKey: string): number {
  const [seconds, setSeconds] = useState(0);
  const startRef = useRef(Date.now());
  const elapsedRef = useRef(0);

  useEffect(() => {
    // Reset whenever the game instance changes.
    elapsedRef.current = 0;
    startRef.current = Date.now();
    setSeconds(0);
  }, [resetKey]);

  useEffect(() => {
    if (!running) {
      elapsedRef.current = seconds;
      return;
    }
    startRef.current = Date.now();
    const id = setInterval(() => {
      setSeconds(elapsedRef.current + Math.floor((Date.now() - startRef.current) / 1000));
    }, 250);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, resetKey]);

  return seconds;
}

export function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}
