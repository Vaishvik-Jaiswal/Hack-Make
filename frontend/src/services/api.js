import axios from 'axios';
import config from '../config/api';

const api = axios.create({
  baseURL: config.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  transformRequest: [
    (data, headers) => {
      // Don't transform FormData - let axios handle it
      if (data instanceof FormData) {
        delete headers['Content-Type'];
        return data;
      }
      return data;
    },
    ...axios.defaults.transformRequest,
  ],
});

export default api;
