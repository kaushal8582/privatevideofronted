import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext.jsx';
import { UploadQueueProvider } from './context/UploadQueueContext.jsx';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <UploadQueueProvider>
          <App />
          <Toaster
            position="bottom-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#0c1222',
                color: '#fff',
                borderRadius: '12px',
                fontSize: '14px',
              },
            }}
          />
        </UploadQueueProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
