import { useEffect, useRef } from 'react';

type UseDelayedEffectCallback = () => void | (() => void);
type UseDelayedEffectDeps = any[];

function useDelayedEffect(
  callback: UseDelayedEffectCallback,
  delay: number,
  deps: UseDelayedEffectDeps,
) {
  const savedCallback = useRef<UseDelayedEffectCallback>();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    // Set up the timeout.
    const handler = () => {
      if (savedCallback.current) {
        savedCallback.current();
      }
    };

    const id = setTimeout(handler, delay);

    // Clean up the timeout if the component is unmounted or if the delay changes.
    return () => clearTimeout(id);
  }, [delay, ...deps]);
}

export default useDelayedEffect;
