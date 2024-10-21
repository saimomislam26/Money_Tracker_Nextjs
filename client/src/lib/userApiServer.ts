import axios from "axios";
import { cookies } from "next/headers";

export const getUserInfo = async () => {
    try {
        const cookieStore = cookies();
        const token = cookieStore.get('token');
        
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/get-user-info`, {
            headers: {
                Authorization: `Bearer ${token?.value}`
            },
        })

        return response.data;

    } catch (error) {
        if (axios.isAxiosError(error)) {
            // Axios-specific error handling
            if (error.response) {
                console.error('Error response:', error.response);
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

