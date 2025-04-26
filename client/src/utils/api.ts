import axios from 'axios';
import { API_URL } from './constants';

axios.defaults.baseURL = API_URL;

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const storeApi = {
  getAll: (filters = {}) => axios.get('/stores', { params: filters }),
  getById: (id: unknown) => axios.get(`/stores/${id}`),
  create: (data: unknown) => axios.post('/stores', data),
  update: (id: unknown, data: unknown) => axios.put(`/stores/${id}`, data),
  delete: (id: unknown) => axios.delete(`/stores/${id}`)
};

export const userApi = {
  getAll: (filters = {}) => axios.get('/users', { params: filters }),
  getById: (id: unknown) => axios.get(`/users/${id}`),
  create: (data: unknown) => axios.post('/users', data),
  update: (id: unknown, data: unknown) => axios.put(`/users/${id}`, data),
  delete: (id: unknown) => axios.delete(`/users/${id}`)
};

export const ratingApi = {
  submitRating: (data: unknown) => axios.post('/ratings', data),
  getStoreRatings: (storeId: unknown) => axios.get(`/ratings/store/${storeId}`),
  getUserRatings: (userId: unknown) => axios.get(`/ratings/user/${userId}`),
  deleteRating: (id: unknown) => axios.delete(`/ratings/${id}`)
};

export const dashboardApi = {
  getAdminStats: () => axios.get('/dashboard/admin'),
  getStoreOwnerStats: () => axios.get('/dashboard/store-owner')
};

export default {
  storeApi,
  userApi,
  ratingApi,
  dashboardApi
};