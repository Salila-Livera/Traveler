import api from '../utils/api';

export function register({ name, email, password }) {
  return api.post('/auth/register', { name, email, password });
}

export async function login({ email, password }) {
  const { data } = await api.post('/auth/login', { email, password });
  // data = { token, userId }
  localStorage.setItem('token', data.token);
  localStorage.setItem('userId', data.userId);
  api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
  return data;
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  delete api.defaults.headers.common['Authorization'];
}
