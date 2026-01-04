import axios from 'axios';

export const authApi = axios.create({
  baseURL: 'http://localhost:4001/auth',
});

export const userApi = axios.create({
  baseURL: 'http://localhost:4002',
});

export const leadApi = axios.create({
  baseURL: 'http://localhost:4003/leads',
});

const attachToken = (config: any) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

authApi.interceptors.request.use(attachToken);
userApi.interceptors.request.use(attachToken);
leadApi.interceptors.request.use(attachToken);


export default axios;