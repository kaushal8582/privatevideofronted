import axios from 'axios';

const TOKEN_KEY = 'mastplayer_token';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 30 * 60 * 1000,
});

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY);

export const setStoredToken = (token) => {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
};

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      const url = String(error?.config?.url || '');
      const isAuthRoute =
        url.includes('/auth/login') ||
        url.includes('/auth/register') ||
        url.includes('/auth/google');
      if (!isAuthRoute && getStoredToken()) {
        setStoredToken(null);
        window.dispatchEvent(new Event('mastplayer:logout'));
      }
    }
    return Promise.reject(error);
  }
);

export const getFriendlyError = (error, fallback = 'Something went wrong.') => {
  const status = error?.response?.status;
  if (status === 413) {
    return 'File too large for the server proxy. Use chunked upload or raise client_max_body_size.';
  }
  const data = error?.response?.data;
  if (typeof data === 'string' && data.includes('413')) {
    return 'File too large for the server proxy (413).';
  }
  return data?.message || error?.message || fallback;
};

export const register = (payload) => api.post('/auth/register', payload);

export const login = (payload) => api.post('/auth/login', payload);

export const loginWithGoogle = (idToken) => api.post('/auth/google', { idToken });

export const fetchMe = () => api.get('/auth/me');

export const updateMe = (payload) => api.patch('/auth/me', payload);

export const fetchDashboardStats = () => api.get('/dashboard/stats');

/** @deprecated Prefer uploadVideoChunked for production (avoids 413). */
export const uploadVideo = (file, onUploadProgress, signal) => {
  const formData = new FormData();
  formData.append('video', file);

  return api.post('/videos/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
    signal,
  });
};

export const fetchVideos = (page = 1, limit = 20) => {
  return api.get('/videos', { params: { page, limit } });
};

export const fetchVideoById = (id) => {
  return api.get(`/videos/${id}`);
};

export const fetchVideoByShareToken = (shareToken) => {
  return api.get(`/videos/share/${shareToken}`);
};

export const deleteVideo = (id) => {
  return api.delete(`/videos/${id}`);
};

export const healthCheck = () => {
  return api.get('/health');
};

export default api;
