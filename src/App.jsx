import { Link, Navigate, Routes, Route, Outlet } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import BackgroundUploadPanel from './components/BackgroundUploadPanel.jsx';
import FooterSocialLinks from './components/FooterSocialLinks.jsx';
import StudioLayout from './layouts/StudioLayout.jsx';
import Landing from './pages/Landing.jsx';
import WatchVideo from './pages/WatchVideo.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';
import DmcaPolicy from './pages/DmcaPolicy.jsx';
import Contact from './pages/Contact.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import NotFound from './pages/NotFound.jsx';
import StudioOverview from './pages/studio/Overview.jsx';
import StudioVideos from './pages/studio/Videos.jsx';
import StudioUpload from './pages/studio/Upload.jsx';
import StudioProfile from './pages/studio/Profile.jsx';
import StudioReferrals from './pages/studio/Referrals.jsx';
import StudioOgEarn from './pages/studio/OgEarn.jsx';
import StudioTelegram from './pages/studio/Telegram.jsx';
import StudioMp2mpBot from './pages/studio/Mp2mpBot.jsx';
import StudioPayouts from './pages/studio/Payouts.jsx';

function MarketingShell() {
  return (
    <div className="app-shell min-h-screen flex flex-col overflow-x-clip">
      <Navbar />
      <main className="flex-1 w-full min-w-0">
        <Outlet />
      </main>
      <footer className="border-t border-[var(--border)] py-4 sm:py-6">
        <div className="app-container px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 text-sm app-muted">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span>© {new Date().getFullYear()} MastPlayer</span>
            <FooterSocialLinks />
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <Link to="/contact" className="app-link text-sm">
              Contact
            </Link>
            <Link to="/privacy" className="app-link text-sm">
              Privacy Policy
            </Link>
            <Link to="/dmca" className="app-link text-sm">
              DMCA / Copyright
            </Link>
          </div>
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
          <Route path="/dmca" element={<DmcaPolicy />} />
          <Route path="/contact" element={<Contact />} />
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
          <Route path="referrals" element={<StudioReferrals />} />
          <Route path="og-earn" element={<StudioOgEarn />} />
          <Route path="telegram" element={<StudioTelegram />} />
          <Route path="mp2mp-bot" element={<StudioMp2mpBot />} />
          <Route path="payouts" element={<StudioPayouts />} />
          <Route path="profile" element={<StudioProfile />} />
        </Route>
      </Routes>
      <BackgroundUploadPanel />
      <Analytics />
    </>
  );
}
