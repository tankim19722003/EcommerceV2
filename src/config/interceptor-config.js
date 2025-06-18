// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1', // your backend base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // Get the token from wherever you store it (localStorage, Redux, Context, etc.)
    const jsonUser = localStorage.getItem('user');
    const token = jsonUser ? JSON.parse(jsonUser).token : null;

    if (token) {
      // Attach token to Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;  // important to return config!
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

export default api;