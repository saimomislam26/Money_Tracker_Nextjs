'use client'

import { decrement, increment } from "@/store/counterSlice";
import { RootState } from "@/store/store";
import axios, { AxiosError } from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { apiCall } from "@/utils/apiClient";
import { useRouter } from "next/navigation";

export default function Home() {

  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();
  const router = useRouter()

  const fetchDummy = async () => {
    try {
      const data = await apiCall({
        url: '/user/dummyfetch',
        method: "GET"
      })
      console.log(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          router.push('/login');
        }
      } else {
        console.error('An unexpected error occurred:', error);
      }
    }
  }

  useEffect(() => {
    fetchDummy()
  }, [])

  return (
    <main className="flex flex-col justify-center items-center gap-y-5 h-dvh bg-white dark:bg-gray-900 text-black dark:text-white border border-red-500">
      <h1>Counter: {count}</h1>
      <div className="flex flex-row gap-x-5 ">
        <button className="border border-red-600 shadow-lg px-5 py-2 rounded-md" onClick={() => dispatch(increment())}>Increment</button>
        <button className="border border-red-600 shadow-lg px-5 py-2 rounded-md" onClick={() => dispatch(decrement())}>Decrement</button>
      </div>
    </main>
  );
}
