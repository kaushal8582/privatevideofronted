import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { UploadQueueProvider } from './context/UploadQueueContext.jsx';
import App from './App.jsx';
import './pwa/installPrompt.js';
import './index.css';

const CHUNK_RELOAD_KEY = 'mastplayer-chunk-reload-at';

window.addEventListener('vite:preloadError', (event) => {
  const last = Number(sessionStorage.getItem(CHUNK_RELOAD_KEY) || 0);
  if (Date.now() - last < 60_000) return;
  event.preventDefault();
  sessionStorage.setItem(CHUNK_RELOAD_KEY, String(Date.now()));
  window.location.reload();
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <UploadQueueProvider>
            <App />
            <Toaster
              position="bottom-center"
              containerStyle={{ bottom: 'calc(16px + var(--bottom-nav-offset, 0px))' }}
              toastOptions={{
                duration: 3000,
                style: {
                  background: 'var(--surface-elevated)',
                  color: 'var(--foreground)',
                  border: '1px solid var(--border-accent)',
                  borderRadius: '12px',
                  fontSize: '14px',
                },
              }}
            />
          </UploadQueueProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
