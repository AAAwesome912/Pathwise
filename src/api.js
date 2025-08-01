// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.baseURL,  // your NestJS server
});

// automatically add JWT token if present
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
