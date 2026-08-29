import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ExternalLink, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import UploadZone from '../components/UploadZone.jsx';
import UploadProgress from '../components/UploadProgress.jsx';
import CopyLinkButton from '../components/CopyLinkButton.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useUploadQueue } from '../context/UploadQueueContext.jsx';

export default function UploadPage() {
  const { user } = useAuth();
  const { job, isUploading, startUpload, clearJob } = useUploadQueue();
  const [file, setFile] = useState(null);
  const [localError, setLocalError] = useState(null);

  const handleUpload = async () => {
    if (!file || isUploading) return;
    setLocalError(null);
    const outcome = await startUpload(file);
    if (!outcome.started) {
      setLocalError(outcome.reason || 'Could not start upload.');
      toast.error(outcome.reason || 'Could not start upload.');
      return;
    }
    setFile(null);
  };

  const showSuccessOnPage = job.status === 'success' && job.result;

  return (
    <div className="max-w-2xl mx-auto">
      <section className="text-center mb-10 sm:mb-12">
        <p className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl md:text-6xl text-[#0c1222] mb-4 leading-tight">
          Upload &amp; Share
        </p>
        <p className="text-lg text-[#5b657a] max-w-lg mx-auto">
          Hi{user?.name ? `, ${user.name}` : ''} — large files upload in the background. Start
          upload, then browse My Videos or other pages while it finishes.
        </p>
      </section>

      {isUploading && (
        <div className="mb-6 rounded-2xl border border-teal-200 bg-teal-50/70 px-5 py-4 space-y-3">
          <p className="text-sm font-semibold text-teal-900">
            Uploading in background — {job.progress}%
          </p>
          <UploadProgress progress={job.progress} />
          <p className="text-sm text-teal-900/80">
            You can leave this page. A progress card stays at the bottom-right. Keep this browser
            tab open until it finishes.
          </p>
          <Link
            to="/videos"
            className="inline-flex text-sm font-semibold text-teal-800 hover:underline"
          >
            Go to My Videos →
          </Link>
        </div>
      )}

      {!showSuccessOnPage && (
        <div className="space-y-5">
          <UploadZone
            file={file}
            onFileSelect={setFile}
            onClear={() => setFile(null)}
            disabled={isUploading}
          />

          {localError && (
            <p className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              {localError}
            </p>
          )}

          {job.status === 'error' && job.error && (
            <p className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              {job.error}
            </p>
          )}

          {file && !isUploading && (
            <button
              type="button"
              onClick={handleUpload}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-teal-800 text-white px-5 py-3.5 text-base font-semibold hover:bg-teal-700 shadow-sm"
            >
              <Upload className="w-5 h-5" />
              Start background upload
            </button>
          )}
        </div>
      )}

      {showSuccessOnPage && (
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
              {job.result.shareUrl}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <CopyLinkButton url={job.result.shareUrl} className="w-full sm:w-auto" />
            <Link
              to={`/v/${job.result.shareToken}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#e6e1d8] bg-white px-4 py-2.5 text-sm font-medium hover:bg-[#f7f5f1] w-full sm:w-auto"
            >
              <ExternalLink className="w-4 h-4" />
              Open link
            </Link>
          </div>

          <button
            type="button"
            onClick={clearJob}
            className="text-sm font-medium text-teal-800 hover:underline"
          >
            Upload another video
          </button>
        </div>
      )}
    </div>
  );
}
