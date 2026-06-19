import api from './api';

// Registers a new user
const register = async (name, email, password) => {
  const response = await api.post('/auth/register', { name, email, password });
  
  // If token is returned, save it to local storage
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  
  return response.data;
};

// Logs in an existing user
const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  
  // Save JWT and user details to local storage
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  
  return response.data;
};

// Logs out user by purging local storage credentials
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

const authService = {
  register,
  login,
  logout
};

export default authService;
