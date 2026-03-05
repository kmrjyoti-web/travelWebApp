import axios from 'axios';
import { setupInterceptors } from './interceptors';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? '/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'x-product-id': process.env.NEXT_PUBLIC_PRODUCT_ID ?? 'travel-os',
  },
});

// Pass the fully-initialized instance to avoid circular-import TDZ crash
setupInterceptors(apiClient);

export default apiClient;
