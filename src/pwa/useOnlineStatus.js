import { useSyncExternalStore } from 'react';

const subscribe = (fn) => {
  window.addEventListener('online', fn);
  window.addEventListener('offline', fn);
  return () => {
    window.removeEventListener('online', fn);
    window.removeEventListener('offline', fn);
  };
};

const getSnapshot = () => navigator.onLine;

export default function useOnlineStatus() {
  return useSyncExternalStore(subscribe, getSnapshot, () => true);
}
