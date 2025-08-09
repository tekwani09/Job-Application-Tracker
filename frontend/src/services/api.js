import axios from 'axios';

import { API_BASE_URL } from '../config/api';

const API_BASE_URL_WITH_API = API_BASE_URL;

const API = axios.create({
  baseURL: `${API_BASE_URL_WITH_API}/api`,
});

// Add JWT token to every request if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
