import axios from 'axios';

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_URL = import.meta.env.VITE_API_URL || 'https://safe-vend-backend.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  crossdomain: true
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and unwrap data
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle network errors
    if (error.code === 'ERR_NETWORK') {
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }

    // Handle timeouts
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Request timeout. Please try again.'));
    }

    // Handle server response errors
    if (error.response) {
      const { status, data } = error.response;
      let message = 'An error occurred';
      
      // Handle different HTTP status codes
      switch (status) {
        case 400:
          message = data?.message || 'Bad request';
          break;
        case 401:
          message = 'Session expired. Please log in again.';
          // Optionally clear auth and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;
        case 403:
          message = 'You do not have permission to perform this action';
          break;
        case 404:
          message = 'The requested resource was not found';
          break;
        case 500:
          message = 'Internal server error. Please try again later.';
          break;
        default:
          message = data?.message || 'An unexpected error occurred';
      }

      return Promise.reject(new Error(message, { 
        cause: { 
          status,
          data: data,
          originalError: error 
        } 
      }));
    }

    // Handle request setup errors
    return Promise.reject(error.message ? new Error(error.message) : new Error('An unknown error occurred'));
  }
);

// Dashboard endpoints
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getRecentTransactions: (limit = 5) => api.get('/transactions', { params: { limit } }),
  getDeviceStatus: () => api.get('/devices/status'),
};

// Device endpoints
export const deviceAPI = {
  getDevices: (params = {}) => api.get('/devices', { params }),
  getDevice: (id) => api.get(`/devices/${id}`),
  createDevice: (data) => api.post('/devices', data),
  updateDevice: (id, data) => api.put(`/devices/${id}`, data),
  deleteDevice: (id) => api.delete(`/devices/${id}`),
  
  // Device Product Management
  addDeviceProduct: (deviceId, productData) => 
    api.post(`/devices/${deviceId}/products`, productData),
    
  updateDeviceProduct: (deviceId, productId, data) => 
    api.put(`/devices/${deviceId}/products/${productId}`, data),
    
  removeDeviceProduct: (deviceId, productId) => 
    api.delete(`/devices/${deviceId}/products/${productId}`)
};

// Product endpoints
export const productAPI = {
  getProducts: (params = {}) => api.get('/products', { params }),
  getProduct: (id) => api.get(`/products/${id}`),
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  updateStock: (id, data) => api.put(`/products/${id}/stock`, data),
};

// Transaction endpoints
export const transactionAPI = {
  getTransactions: (params = {}) => api.get('/transactions', { params }),
  getTransaction: (id) => api.get(`/transactions/${id}`),
  createTransaction: (data) => api.post('/transactions', data),
  refundTransaction: (id) => api.post(`/transactions/${id}/refund`),
  exportTransactions: (params = {}) => api.get('/transactions/export', { 
    params,
    responseType: 'blob' 
  })
};

// Report endpoints
export const reportAPI = {
  getSalesReport: (params = {}) => api.get('/reports/sales', { params }),
  getInventoryReport: (params = {}) => api.get('/reports/inventory', { params }),
  getDeviceReport: (params = {}) => api.get('/reports/devices', { params }),
};

export default api;
