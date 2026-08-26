import axios from 'axios';

const TOKEN_KEY = 'mastplayer_token';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10 * 60 * 1000,
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
      const isAuthRoute = url.includes('/auth/login') || url.includes('/auth/register');
      if (!isAuthRoute && getStoredToken()) {
        setStoredToken(null);
        window.dispatchEvent(new Event('mastplayer:logout'));
      }
    }
    return Promise.reject(error);
  }
);

export const getFriendlyError = (error, fallback = 'Something went wrong.') => {
  return error?.response?.data?.message || error?.message || fallback;
};

export const register = (payload) => api.post('/auth/register', payload);

export const login = (payload) => api.post('/auth/login', payload);

export const fetchMe = () => api.get('/auth/me');

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
