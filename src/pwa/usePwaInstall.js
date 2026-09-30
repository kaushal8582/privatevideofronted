import { useSyncExternalStore } from 'react';
import {
  dismissInstall,
  getInstallSnapshot,
  promptInstall,
  subscribeInstall,
} from './installPrompt.js';

export default function usePwaInstall() {
  const state = useSyncExternalStore(subscribeInstall, getInstallSnapshot, getInstallSnapshot);
  return { ...state, promptInstall, dismissInstall };
}
