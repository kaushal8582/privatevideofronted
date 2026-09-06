import api, { getFriendlyError } from './api.js';

const CONCURRENCY = 3;

/**
 * Read duration + JPEG thumbnail from a local video File in the browser.
 */
export function readLocalVideoMeta(file) {
  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;

    const cleanup = () => {
      URL.revokeObjectURL(objectUrl);
      video.removeAttribute('src');
      video.load();
    };

    const fail = () => {
      cleanup();
      resolve({ duration: null, thumbnailBlob: null });
    };

    video.onerror = fail;

    video.onloadedmetadata = () => {
      const duration = Number.isFinite(video.duration) ? video.duration : null;
      const seekTo =
        duration && duration > 1 ? Math.min(1, duration * 0.1) : 0.1;
      const onSeeked = () => {
        try {
          const canvas = document.createElement('canvas');
          const w = video.videoWidth || 640;
          const h = video.videoHeight || 360;
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(video, 0, 0, w, h);
          canvas.toBlob(
            (blob) => {
              cleanup();
              resolve({ duration, thumbnailBlob: blob });
            },
            'image/jpeg',
            0.82
          );
        } catch {
          cleanup();
          resolve({ duration, thumbnailBlob: null });
        }
      };
      video.addEventListener('seeked', onSeeked, { once: true });
      try {
        video.currentTime = seekTo;
      } catch {
        cleanup();
        resolve({ duration, thumbnailBlob: null });
      }
    };

    video.src = objectUrl;
  });
}

/**
 * Convert an image File/Blob to JPEG for R2 thumbnail upload.
 */
export function imageFileToJpegBlob(file, maxEdge = 1280, quality = 0.85) {
  return new Promise((resolve) => {
    if (!file) {
      resolve(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      try {
        let { width, height } = img;
        const scale = Math.min(1, maxEdge / Math.max(width, height));
        width = Math.max(1, Math.round(width * scale));
        height = Math.max(1, Math.round(height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(objectUrl);
            resolve(blob);
          },
          'image/jpeg',
          quality
        );
      } catch {
        URL.revokeObjectURL(objectUrl);
        resolve(null);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(null);
    };
    img.src = objectUrl;
  });
}

async function uploadPart(url, blob, signal) {
  const res = await fetch(url, {
    method: 'PUT',
    body: blob,
    signal,
  });

  if (!res.ok) {
    throw new Error(`Chunk upload failed (${res.status})`);
  }

  const etag = res.headers.get('etag') || res.headers.get('ETag');
  if (!etag) {
    throw new Error(
      'Missing ETag from storage. Configure R2 CORS to ExposeHeaders: ETag.'
    );
  }

  return etag;
}

/**
 * Chunked direct upload to R2 via presigned URLs.
 * Bypasses API reverse-proxy body size limits (413).
 */
export async function uploadVideoChunked(file, onProgress, signal, options = {}) {
  const telegramDestinationIds = Array.isArray(options.telegramDestinationIds)
    ? options.telegramDestinationIds
    : [];
  const customTitle = String(options.title || '').trim();
  const customThumbnailFile = options.thumbnailFile || null;

  const { data: initRes } = await api.post(
    '/videos/upload/init',
    {
      filename: file.name,
      mimeType: file.type || 'video/mp4',
      size: file.size,
      ...(customTitle ? { title: customTitle.slice(0, 120) } : {}),
    },
    { signal }
  );

  const {
    sessionId,
    partSize,
    parts,
    thumbnailUploadUrl,
  } = initRes.data;

  let uploadedBytes = 0;
  const completed = [];
  let cursor = 0;

  const report = () => {
    if (!onProgress) return;
    onProgress({
      loaded: Math.min(uploadedBytes, file.size),
      total: file.size,
    });
  };

  const worker = async () => {
    while (cursor < parts.length) {
      if (signal?.aborted) {
        throw new DOMException('Aborted', 'AbortError');
      }
      const index = cursor;
      cursor += 1;
      const part = parts[index];
      const start = (part.partNumber - 1) * partSize;
      const end = Math.min(start + partSize, file.size);
      const chunk = file.slice(start, end);
      const etag = await uploadPart(part.url, chunk, signal);
      completed.push({ partNumber: part.partNumber, etag });
      uploadedBytes += chunk.size;
      report();
    }
  };

  try {
    const pool = Array.from({ length: Math.min(CONCURRENCY, parts.length) }, () =>
      worker()
    );
    await Promise.all(pool);

    const meta = await readLocalVideoMeta(file);
    let hasThumbnail = false;

    let thumbBlob = null;
    if (customThumbnailFile) {
      thumbBlob = await imageFileToJpegBlob(customThumbnailFile);
    }
    if (!thumbBlob) {
      thumbBlob = meta.thumbnailBlob;
    }

    if (thumbBlob && thumbnailUploadUrl) {
      const thumbRes = await fetch(thumbnailUploadUrl, {
        method: 'PUT',
        body: thumbBlob,
        headers: { 'Content-Type': 'image/jpeg' },
        signal,
      });
      hasThumbnail = thumbRes.ok;
    }

    const { data: completeRes } = await api.post(
      '/videos/upload/complete',
      {
        sessionId,
        parts: completed.sort((a, b) => a.partNumber - b.partNumber),
        duration: meta.duration,
        hasThumbnail,
        telegramDestinationIds,
      },
      { signal }
    );

    return completeRes;
  } catch (err) {
    try {
      await api.post('/videos/upload/abort', { sessionId });
    } catch {
      // ignore abort failures
    }

    if (err?.name === 'AbortError' || err?.code === 'ERR_CANCELED') {
      throw err;
    }

    const message = getFriendlyError(
      err,
      err?.message || 'Chunked upload failed. Check R2 CORS (PUT + Expose ETag).'
    );
    const wrapped = new Error(message);
    wrapped.cause = err;
    throw wrapped;
  }
}
