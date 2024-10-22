// utils/apiClient.ts
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { NextRouter, Router, useRouter } from 'next/router';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,  
});

// Add a request interceptor to inject the token into the headers
apiClient.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

const handleUnauthorizedError = () => {
  Cookies.remove('token', { path: "/" });
  // router.push('/login')
  toast.warning("Unauthorized User")

};

// Centralized API call with 401 handler
export const apiCall = async <T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
  try {
    const response = await apiClient(config);
    return response;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response?.status === 401) {
      handleUnauthorizedError();
    }
    throw axiosError;
  }
};
