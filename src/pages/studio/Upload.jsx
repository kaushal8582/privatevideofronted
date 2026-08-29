import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ExternalLink, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import UploadZone from '../../components/UploadZone.jsx';
import UploadProgress from '../../components/UploadProgress.jsx';
import CopyLinkButton from '../../components/CopyLinkButton.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useUploadQueue } from '../../context/UploadQueueContext.jsx';

export default function StudioUpload() {
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
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl tracking-tight">
          Upload
        </h1>
        <p className="mt-2 text-[#64748b]">
          Hi{user?.name ? `, ${user.name}` : ''} — large files upload in the background. Keep this
          tab open until it finishes.
        </p>
      </div>

      {isUploading && (
        <div className="rounded-2xl border border-teal-200 bg-teal-50/70 px-5 py-4 space-y-3">
          <p className="text-sm font-semibold text-teal-900">
            Uploading in background — {job.progress}%
          </p>
          <UploadProgress progress={job.progress} />
          <Link
            to="/studio/videos"
            className="inline-flex text-sm font-semibold text-teal-800 hover:underline"
          >
            Go to Videos →
          </Link>
        </div>
      )}

      {!showSuccessOnPage && (
        <div className="space-y-5 rounded-2xl border border-[#e2e8f0] bg-white p-5 sm:p-6 shadow-sm">
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
            <h2 className="text-2xl font-semibold mb-2">Upload complete</h2>
            <p className="text-[#64748b]">Share the link — playback and views happen in the app.</p>
          </div>
          <div className="rounded-xl bg-[#f8fafc] border border-[#e2e8f0] px-4 py-3 text-left">
            <p className="text-xs font-medium uppercase tracking-wide text-[#64748b] mb-1">
              Share link
            </p>
            <p className="text-sm break-all font-medium">{job.result.shareUrl}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <CopyLinkButton url={job.result.shareUrl} className="w-full sm:w-auto" />
            <Link
              to={`/v/${job.result.shareToken}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#e2e8f0] bg-white px-4 py-2.5 text-sm font-medium hover:bg-[#f8fafc] w-full sm:w-auto"
            >
              <ExternalLink className="w-4 h-4" />
              Open preview
            </Link>
            <Link
              to="/studio/videos"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-800 text-white px-4 py-2.5 text-sm font-semibold w-full sm:w-auto"
            >
              Library
            </Link>
          </div>
          <button
            type="button"
            onClick={clearJob}
            className="text-sm font-medium text-teal-800 hover:underline"
          >
            Upload another
          </button>
        </div>
      )}
    </div>
  );
}
