import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:8000/api/',
  timeout: 15000,
});

// Helpful debug: print the base URL so you can verify requests go to the expected backend
try {
  // eslint-disable-next-line no-console
  console.log('API base URL:', api.defaults.baseURL);
} catch (e) {
  // ignore in environments where console may not be available
}

export default api;
