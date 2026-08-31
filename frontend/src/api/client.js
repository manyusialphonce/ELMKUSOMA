import axios from 'axios';

const client = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    'http://localhost:3000/api/v1',

  headers: {
    'Content-Type': 'application/json',
  },
});


// ==============================
// ATTACH JWT TOKEN
// ==============================

client.interceptors.request.use((config) => {
  const token = localStorage.getItem(
    'elmkusoma_token'
  );

  if (token) {
    config.headers.Authorization =
      `Bearer ${token}`;
  }

  return config;
});


// ==============================
// HANDLE UNAUTHORIZED RESPONSE
// ==============================

client.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(
        'elmkusoma_token'
      );
    }

    return Promise.reject(error);
  }
);


export default client;