// src/api.js
import axios from 'axios';

// Axios instance có sẵn Content-Type: application/json
const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Axios instance KHÔNG có Content-Type (dùng cho FormData)
const apiNotHasTheHeader = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
});

// Add interceptor cho cả 2
const addAuthInterceptor = (instance) => {
  instance.interceptors.request.use(
    (config) => {
      const jsonUser = localStorage.getItem('user');
      const token = jsonUser ? JSON.parse(jsonUser).token : null;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );
};

addAuthInterceptor(api);
addAuthInterceptor(apiNotHasTheHeader);

// Named exports
export { api, apiNotHasTheHeader };
