import { Link, Navigate, Routes, Route, Outlet } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import BackgroundUploadPanel from './components/BackgroundUploadPanel.jsx';
import StudioLayout from './layouts/StudioLayout.jsx';
import Landing from './pages/Landing.jsx';
import WatchVideo from './pages/WatchVideo.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import NotFound from './pages/NotFound.jsx';
import StudioOverview from './pages/studio/Overview.jsx';
import StudioVideos from './pages/studio/Videos.jsx';
import StudioUpload from './pages/studio/Upload.jsx';
import StudioProfile from './pages/studio/Profile.jsx';
import StudioReferrals from './pages/studio/Referrals.jsx';

function MarketingShell() {
  return (
    <div className="app-shell min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <footer className="border-t border-[var(--border)] py-6">
        <div className="app-container px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3 text-sm app-muted">
          <span>© {new Date().getFullYear()} MastPlayer</span>
          <Link to="/privacy" className="app-link text-sm">
            Privacy Policy
          </Link>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />

        <Route element={<MarketingShell />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/v/:shareToken" element={<WatchVideo />} />
          <Route path="/upload" element={<Navigate to="/studio/upload" replace />} />
          <Route path="/videos" element={<Navigate to="/studio/videos" replace />} />
          <Route path="/profile" element={<Navigate to="/studio/profile" replace />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route
          path="/studio"
          element={
            <ProtectedRoute>
              <StudioLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<StudioOverview />} />
          <Route path="videos" element={<StudioVideos />} />
          <Route path="upload" element={<StudioUpload />} />
          <Route path="profile" element={<StudioProfile />} />
          <Route path="referrals" element={<StudioReferrals />} />
        </Route>
      </Routes>
      <BackgroundUploadPanel />
      <Analytics />
    </>
  );
}
