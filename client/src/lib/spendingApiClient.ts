import { apiCall } from "@/utils/apiClient";
import axios from "axios";
import { toast } from "react-toastify";

export const createExpense = async (expenseInfo: { day: string, month: string, year: string, categories: { category: string; name: string; amount?: number }[]}) => {
  try {
    const response = await apiCall({
      url: '/expense/create-expense',
      method: 'POST',
      data: expenseInfo,
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

export const getExpense = async(year:number,month:number,sort:string)=>{
  try {
    const response = await apiCall({
      url: `/expense/get-all-expense/${year}/${month}?sort=${sort}`,
      method: 'GET',
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
}

export const updateExpense = async(year:number,month:number,day:number,categories:{category:string,amount:number,_id:string}[])=>{
  try {
    const response = await apiCall({
      url: `/expense/update-expense`,
      method: 'PUT',
      data:{
        year,
        month,
        day,
        categories
      },
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
}



