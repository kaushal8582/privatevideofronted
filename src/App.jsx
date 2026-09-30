import { lazy, Suspense } from 'react';
import { Navigate, Routes, Route, Outlet } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import BackgroundUploadPanel from './components/BackgroundUploadPanel.jsx';
import LoadingState from './components/LoadingState.jsx';
import DeveloperToolsNotice from './components/DeveloperToolsNotice.jsx';
import useDeveloperToolsWarning from './hooks/useDeveloperToolsWarning.js';
import LandingFooter from './components/landing/LandingFooter.jsx';
import StudioLayout from './layouts/StudioLayout.jsx';
import Landing from './pages/Landing.jsx';
import OfflineScreen from './pwa/OfflineScreen.jsx';
import PwaUpdatePrompt from './pwa/PwaUpdatePrompt.jsx';

const WatchVideo = lazy(() => import('./pages/WatchVideo.jsx'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy.jsx'));
const TermsOfService = lazy(() => import('./pages/TermsOfService.jsx'));
const DmcaPolicy = lazy(() => import('./pages/DmcaPolicy.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Register = lazy(() => import('./pages/Register.jsx'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail.jsx'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));
const StudioOverview = lazy(() => import('./pages/studio/Overview.jsx'));
const StudioVideos = lazy(() => import('./pages/studio/Videos.jsx'));
const StudioUpload = lazy(() => import('./pages/studio/Upload.jsx'));
const StudioProfile = lazy(() => import('./pages/studio/Profile.jsx'));
const StudioReferrals = lazy(() => import('./pages/studio/Referrals.jsx'));
const StudioOgEarn = lazy(() => import('./pages/studio/OgEarn.jsx'));
const StudioTelegram = lazy(() => import('./pages/studio/Telegram.jsx'));
const StudioMp2mpBot = lazy(() => import('./pages/studio/Mp2mpBot.jsx'));
const StudioPayouts = lazy(() => import('./pages/studio/Payouts.jsx'));

function MarketingShell() {
  return (
    <div className="app-shell min-h-screen flex flex-col overflow-x-clip">
      <Navbar />
      <main className="flex-1 w-full min-w-0">
        <Suspense fallback={<LoadingState />}>
          <Outlet />
        </Suspense>
      </main>
      <LandingFooter />
    </div>
  );
}

export default function App() {
  const { devToolsWarningVisible, dismiss } = useDeveloperToolsWarning();

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />

        <Route element={<MarketingShell />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
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
      <PwaUpdatePrompt />
      <OfflineScreen />
      <DeveloperToolsNotice open={devToolsWarningVisible} onReturn={dismiss} />
      <Analytics />
    </>
  );
}
