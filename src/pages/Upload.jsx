import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ExternalLink, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import UploadZone from '../components/UploadZone.jsx';
import UploadProgress from '../components/UploadProgress.jsx';
import CopyLinkButton from '../components/CopyLinkButton.jsx';
import { getFriendlyError } from '../services/api.js';
import { uploadVideoChunked } from '../services/chunkedUpload.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function UploadPage() {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const reset = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    setFile(null);
    setUploading(false);
    setProgress(0);
    setResult(null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file || uploading) return;

    setUploading(true);
    setProgress(0);
    setError(null);
    setResult(null);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const data = await uploadVideoChunked(
        file,
        (event) => {
          if (!event.total) return;
          setProgress(Math.round((event.loaded * 100) / event.total));
        },
        controller.signal
      );

      setProgress(100);
      setResult(data.data);
      toast.success('Video uploaded successfully!');
      setFile(null);
    } catch (err) {
      if (
        err?.code === 'ERR_CANCELED' ||
        err?.name === 'AbortError' ||
        err?.name === 'CanceledError'
      ) {
        setError('Upload cancelled.');
      } else {
        setError(getFriendlyError(err, 'Video upload failed. Please try again.'));
        toast.error('Video upload failed. Please try again.');
      }
    } finally {
      setUploading(false);
      abortRef.current = null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <section className="text-center mb-10 sm:mb-12">
        <p className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl md:text-6xl text-[#0c1222] mb-4 leading-tight">
          Upload &amp; Share
        </p>
        <p className="text-lg text-[#5b657a] max-w-lg mx-auto">
          Hi{user?.name ? `, ${user.name}` : ''} — large videos upload in chunks straight to
          storage. Only you will see them in My Videos.
        </p>
      </section>

      {!result && (
        <div className="space-y-5">
          <UploadZone
            file={file}
            onFileSelect={setFile}
            onClear={() => setFile(null)}
            disabled={uploading}
          />

          {uploading && <UploadProgress progress={progress} />}

          {error && (
            <p className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          {file && !uploading && (
            <button
              type="button"
              onClick={handleUpload}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-teal-800 text-white px-5 py-3.5 text-base font-semibold hover:bg-teal-700 shadow-sm"
            >
              <Upload className="w-5 h-5" />
              Upload Video
            </button>
          )}
        </div>
      )}

      {result && (
        <div className="rounded-2xl border border-teal-200 bg-white p-6 sm:p-8 text-center space-y-6 shadow-sm">
          <div className="mx-auto w-14 h-14 rounded-full bg-teal-50 text-teal-800 flex items-center justify-center">
            <Check className="w-7 h-7" />
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2">Upload Complete!</h2>
            <p className="text-[#5b657a]">
              Anyone with this link can open it. Playback streams in the app.
            </p>
          </div>

          <div className="rounded-xl bg-[#f7f5f1] border border-[#e6e1d8] px-4 py-3 text-left">
            <p className="text-xs font-medium uppercase tracking-wide text-[#5b657a] mb-1">
              Share this video
            </p>
            <p className="text-sm sm:text-base break-all text-[#0c1222] font-medium">
              {result.shareUrl}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <CopyLinkButton url={result.shareUrl} className="w-full sm:w-auto" />
            <Link
              to={`/v/${result.shareToken}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#e6e1d8] bg-white px-4 py-2.5 text-sm font-medium hover:bg-[#f7f5f1] w-full sm:w-auto"
            >
              <ExternalLink className="w-4 h-4" />
              Open link
            </Link>
          </div>

          <button
            type="button"
            onClick={reset}
            className="text-sm font-medium text-teal-800 hover:underline"
          >
            Upload another video
          </button>
        </div>
      )}
    </div>
  );
}
