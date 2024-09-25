
import { RootState } from "@/redux/store/store";
import axios, { AxiosError } from "axios";
import { useDispatch, useSelector } from "react-redux";
import HomeModal from "@/components/HomePage/HomeModal";
import { getUserInfo } from "@/lib/api";

export default async function Home() {

  // const router = useRouter()

  // const fetchDummy = async () => {
  //   try {
  //     const data = await apiCall({
  //       url: '/user/dummyfetch',
  //       method: "GET"
  //     })
  //     console.log(data);
  //   } catch (error) {
  //     console.error('Error fetching user data:', error);
  //     if (error instanceof AxiosError) {
  //       if (error.response?.status === 401) {
  //         router.push('/login');
  //       }
  //     } else {
  //       console.error('An unexpected error occurred:', error);
  //     }
  //   }
  // }

 

  return (
    <main className="flex flex-col justify-center items-center gap-y-5 h-dvh bg-white dark:bg-gray-900 text-black dark:text-white border border-red-500">
      {/* <h1>name: {firstName} {income!}</h1> */}
      {/* {<div className="flex flex-row gap-x-5 ">
        <button className="border border-red-600 shadow-lg px-5 py-2 rounded-md" onClick={() => dispatch(increment())}>Increment</button>
        <button className="border border-red-600 shadow-lg px-5 py-2 rounded-md" onClick={() => dispatch(decrement())}>Decrement</button>
      </div>} */}
      <HomeModal/>
    </main>
  );
}
