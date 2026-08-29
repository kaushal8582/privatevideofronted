import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import toast from 'react-hot-toast';
import { getFriendlyError } from '../services/api.js';
import { uploadVideoChunked } from '../services/chunkedUpload.js';

const UploadQueueContext = createContext(null);

const idleState = {
  status: 'idle', // idle | uploading | success | error
  fileName: null,
  fileSize: 0,
  progress: 0,
  result: null,
  error: null,
};

export function UploadQueueProvider({ children }) {
  const [job, setJob] = useState(idleState);
  const abortRef = useRef(null);
  const wakeLockRef = useRef(null);

  const releaseWakeLock = useCallback(async () => {
    try {
      await wakeLockRef.current?.release();
    } catch {
      // ignore
    }
    wakeLockRef.current = null;
  }, []);

  const requestWakeLock = useCallback(async () => {
    if (!('wakeLock' in navigator)) return;
    try {
      wakeLockRef.current = await navigator.wakeLock.request('screen');
      wakeLockRef.current.addEventListener('release', () => {
        wakeLockRef.current = null;
      });
    } catch {
      // Not allowed / unsupported — upload still continues
    }
  }, []);

  const clearJob = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    releaseWakeLock();
    setJob(idleState);
  }, [releaseWakeLock]);

  const cancelUpload = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    releaseWakeLock();
    setJob((prev) => ({
      ...prev,
      status: 'error',
      progress: prev.progress,
      error: 'Upload cancelled.',
      result: null,
    }));
    toast('Upload cancelled');
  }, [releaseWakeLock]);

  const startUpload = useCallback(
    async (file) => {
      if (!file) return { started: false, reason: 'No file' };
      if (job.status === 'uploading') {
        return { started: false, reason: 'An upload is already running in the background.' };
      }

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setJob({
        status: 'uploading',
        fileName: file.name,
        fileSize: file.size,
        progress: 0,
        result: null,
        error: null,
      });

      await requestWakeLock();
      toast.success('Upload started — you can browse other pages.');

      try {
        const data = await uploadVideoChunked(
          file,
          (event) => {
            if (!event.total) return;
            const progress = Math.round((event.loaded * 100) / event.total);
            setJob((prev) =>
              prev.status === 'uploading' ? { ...prev, progress } : prev
            );
          },
          controller.signal
        );

        setJob({
          status: 'success',
          fileName: file.name,
          fileSize: file.size,
          progress: 100,
          result: data.data,
          error: null,
        });
        toast.success('Video uploaded successfully!');
        return { started: true, result: data.data };
      } catch (err) {
        if (
          err?.code === 'ERR_CANCELED' ||
          err?.name === 'AbortError' ||
          err?.name === 'CanceledError'
        ) {
          setJob((prev) => ({
            ...prev,
            status: 'error',
            error: 'Upload cancelled.',
            result: null,
          }));
          return { started: true, cancelled: true };
        }

        const message = getFriendlyError(err, 'Video upload failed. Please try again.');
        setJob((prev) => ({
          ...prev,
          status: 'error',
          error: message,
          result: null,
        }));
        toast.error('Video upload failed.');
        return { started: true, error: message };
      } finally {
        abortRef.current = null;
        releaseWakeLock();
      }
    },
    [job.status, releaseWakeLock, requestWakeLock]
  );

  // Warn if user closes / refreshes tab during upload
  useEffect(() => {
    if (job.status !== 'uploading') return undefined;

    const onBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [job.status]);

  // Re-request wake lock when tab becomes visible again
  useEffect(() => {
    if (job.status !== 'uploading') return undefined;

    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        requestWakeLock();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [job.status, requestWakeLock]);

  // Show progress in the browser tab title
  useEffect(() => {
    const base = 'Mast Player';
    if (job.status === 'uploading') {
      document.title = `Uploading ${job.progress}% · ${base}`;
    } else if (job.status === 'success') {
      document.title = `Uploaded · ${base}`;
    } else {
      document.title = `${base} — Upload & Share Videos`;
    }
  }, [job.status, job.progress]);

  const value = useMemo(
    () => ({
      job,
      isUploading: job.status === 'uploading',
      startUpload,
      cancelUpload,
      clearJob,
    }),
    [job, startUpload, cancelUpload, clearJob]
  );

  return (
    <UploadQueueContext.Provider value={value}>{children}</UploadQueueContext.Provider>
  );
}

export function useUploadQueue() {
  const ctx = useContext(UploadQueueContext);
  if (!ctx) {
    throw new Error('useUploadQueue must be used within UploadQueueProvider');
  }
  return ctx;
}
