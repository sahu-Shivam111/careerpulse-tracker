import axios from 'axios';

// Create a custom axios instance with default configurations
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Targets local Node/Express backend port
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to automatically add JWT token to outgoing requests
api.interceptors.request.use(
  (config) => {
    // Retrieve the token from localStorage
    const token = localStorage.getItem('token');
    
    if (token) {
      // Inject token into Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
