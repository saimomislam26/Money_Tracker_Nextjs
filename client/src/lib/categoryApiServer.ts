import axios from "axios";
// import { cookies } from "next/headers";

export const getAllCategory = async (token:string | null) => {
    try {
        // const cookieStore = cookies();
        // const token = cookieStore.get('token');
        // console.log({token});
        const date = new Date()
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/category/get-all-category?year=${year}&month=${month}`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        })
        // console.log(response.data);
        
        //   toast.success(response.data?.message);
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

