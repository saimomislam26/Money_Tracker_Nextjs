import { apiCall } from '@/utils/apiClient';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';


export const registerUser = async (userData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/create-user`, userData);
    toast.success(response.data?.message)
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Axios-specific error handling
      if (error.response) {
        // Server responded with a status other than 2xx
        console.error('Error response:', error.response.data);
        toast.error(error.response?.data?.message)
        return error.response.data
      } else if (error.request) {
        // Request was made but no response was received
        console.error('Error request:', error.request);
        throw new Error('No response from server. Please try again later.');
      } else {
        // Something happened in setting up the request
        toast.error(error.message)
        console.error('Error message:', error.message);
        return error

      }
    } else {
      // Non-Axios error
      console.error('Unexpected error:', error);
      return error
    }
  }
};

export const loginUser = async (userData: {
  email: string;
  password: string;
}) => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/login-user`, userData, {
      withCredentials: true
    });
    toast.success(response.data?.message)
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Axios-specific error handling
      if (error.response) {
        // Server responded with a status other than 2xx
        console.error('Error response:', error.response.data);
        toast.error(error.response?.data?.message)
        throw error
      } else if (error.request) {
        // Request was made but no response was received
        console.error('Error request:', error.request);
        throw new Error('No response from server. Please try again later.');
      } else {
        // Something happened in setting up the request
        toast.error(error.message)
        console.error('Error message:', error.message);
        throw new Error(error?.message)

      }
    } else {
      // Non-Axios error
      console.error('Unexpected error:', error);
      throw new Error('Unexpected error')

    }
  }
};

export const updateUser = async (userData: {
  password?: string,
  income?: number,
  firstName?: string,
  lastName?: string
}) => {
  try {
    const response = await apiCall({
      url: '/user/update-user',
      method: 'PUT',
      data: userData,
      withCredentials: true
    });

    toast.success(response.data?.message);
    return response.data;

  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Axios-specific error handling
      if (error.response) {
        console.error('Error response:', error.response);
        if (error.response.status !== 401) {
          toast.error(error.response?.data?.message);
        }
        // Instead of returning, throw the error to be caught in updateIncome
        throw error;
      } else if (error.request) {
        console.error('Error request:', error.request);
        throw new Error('No response from server. Please try again later.');
      } else {
        console.error('Error message:', error.message);
        toast.error(error.message);
        throw new Error(error.message); // Throw custom error
      }
    } else {
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred.'); // Generic error thrown
    }
  }
};

export const getUserInfo = async () => {
  try {
    const response = await apiCall({
      url: '/user/get-user-info',
      method: 'GET',
      withCredentials: true
    })

    toast.success(response.data?.message)
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Axios-specific error handling
      if (error.response) {
        // Server responded with a status other than 2xx
        console.error('Error response:', error.response.data);
        if (error.response.status !== 401) toast.error(error.response?.data?.message)
        throw error
      } else if (error.request) {
        // Request was made but no response was received
        toast.error(error.request)
        console.error('Error request:', error.request);
        throw new Error('No response from server. Please try again later.');
      } else {
        // Something happened in setting up the request
        toast.error(error.message)
        console.error('Error message:', error.message);
        throw new Error(error.message);
      }
    } else {
      // Non-Axios error
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred.');
    }
  }
}


