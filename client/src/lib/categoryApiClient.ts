import { apiCall } from "@/utils/apiClient";
import axios from "axios";
import { toast } from "react-toastify";

export const createCategory = async (categoryName: {
    name: string,
    year: number | null
    month: number | null
  }) => {
    try {
      const response = await apiCall({
        url: '/category/create-category',
        method: 'POST',
        data: categoryName,
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

  export const getCategory = async (date:{
    month:number | null
    year: number | null
  }) => {
    try {

      const response = await apiCall({
        url: `/category/get-all-category?year=${date.year}&month=${date.month}`,
        method: 'GET',
        withCredentials: true
      });
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

  export const deleteCategory = async (id:string) => {
    try {
      const response = await apiCall({
        url: `/category/delete-category/${id}`,
        method: 'DELETE',
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

 