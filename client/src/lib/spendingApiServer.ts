import axios from "axios";
import { cookies } from "next/headers";

export const getAllExpense = async (year:number,month:number) => {
    try {
        const cookieStore = cookies();
        const token = cookieStore.get('token');
        // console.log({token});
    
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/expense/get-all-expense/${year}/${month}?sort=serial`, {
            headers: {
                Authorization: `Bearer ${token?.value}`
            }
        })
        // toast.success(response.data?.message);
        return response.data;

    } catch (error) {
        if (axios.isAxiosError(error)) {
            // Axios-specific error handling
            if (error.response) {
                console.error('Error response:', error.response);
                //   if (error.response.status !== 401) {
                //     toast.error(error.response?.data?.message);
                //   }
                // Instead of returning, throw the error to be caught in updateIncome
                throw error;
            } else if (error.request) {
                console.error('Error request:', error.request);
                throw new Error('No response from server. Please try again later.');
            } else {
                console.error('Error message:', error.message);
                //   toast.error(error.message);
                throw new Error(error.message); // Throw custom error
            }
        } else {
            console.error('Unexpected error:', error);
            throw new Error('An unexpected error occurred.'); // Generic error thrown
        }
    }
};

