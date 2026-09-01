import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

// Attach the JWT (stored by the auth store) to every outgoing request.
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('elmkusoma_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On a 401, the token is invalid/expired — clear it so the app falls back
// to the logged-out state instead of retrying forever.
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('elmkusoma_token');
    }
    return Promise.reject(error);
  }
);

export default client;
