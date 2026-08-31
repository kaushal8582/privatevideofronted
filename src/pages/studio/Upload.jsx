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
        <h1 className="app-title">Upload</h1>
        <p className="app-subtitle mt-2">
          Hi{user?.name ? `, ${user.name}` : ''} — large files upload in the background. Keep this
          tab open until it finishes.
        </p>
      </div>

      {isUploading && (
        <div className="app-success-banner space-y-3">
          <p className="text-sm font-semibold text-[var(--primary)]">
            Uploading in background — {job.progress}%
          </p>
          <UploadProgress progress={job.progress} />
          <Link to="/studio/videos" className="app-link text-sm">
            Go to Videos →
          </Link>
        </div>
      )}

      {!showSuccessOnPage && (
        <div className="app-card-padded space-y-5">
          <UploadZone file={file} onFileSelect={setFile} onClear={() => setFile(null)} disabled={isUploading} />

          {localError && <p className="app-error">{localError}</p>}

          {job.status === 'error' && job.error && <p className="app-error">{job.error}</p>}

          {file && !isUploading && (
            <button type="button" onClick={handleUpload} className="app-btn-primary app-btn-primary-lg w-full">
              <Upload className="w-5 h-5" />
              Start background upload
            </button>
          )}
        </div>
      )}

      {showSuccessOnPage && (
        <div className="app-card-padded text-center space-y-6">
          <div className="mx-auto w-14 h-14 rounded-full bg-[var(--accent-medium)] text-[var(--primary)] flex items-center justify-center">
            <Check className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2">Upload complete</h2>
            <p className="app-muted">Share the link — playback and views happen in the app.</p>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-left">
            <p className="text-xs font-medium uppercase tracking-wide app-muted mb-1">Share link</p>
            <p className="text-sm break-all font-medium text-[var(--primary)]">{job.result.shareUrl}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <CopyLinkButton url={job.result.shareUrl} className="w-full sm:w-auto" />
            <Link to={`/v/${job.result.shareToken}`} className="app-btn-secondary w-full sm:w-auto">
              <ExternalLink className="w-4 h-4" />
              Open preview
            </Link>
            <Link to="/studio/videos" className="app-btn-primary w-full sm:w-auto">
              Library
            </Link>
          </div>
          <button type="button" onClick={clearJob} className="app-link text-sm">
            Upload another
          </button>
        </div>
      )}
    </div>
  );
}
