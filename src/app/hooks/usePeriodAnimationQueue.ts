import { useState, useEffect } from 'react';

const PERIOD_DURATION = 500;

export function usePeriodAnimationQueue() {
  const [periodQueue, setPeriodQueue] = useState<number[]>([]);
  const [nextId, setNextId] = useState(0);

  const addPeriod = () => {
    setPeriodQueue(prevQueue => [...prevQueue, nextId]);
    setNextId(id => id + 1);
  };

  useEffect(() => {
    if (periodQueue.length > 0) {
      const timerId = setTimeout(() => {
        setPeriodQueue(periodQueue.slice(1));
      }, PERIOD_DURATION);

      return () => clearTimeout(timerId);
    }
  }, [periodQueue]);

  return { addPeriod, periodQueue };
}