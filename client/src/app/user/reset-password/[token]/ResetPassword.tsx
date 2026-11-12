'use client'
import Loading from '@/components/Loading';
import { changeForgotPassword } from '@/lib/api';
import { useRouter } from 'next/navigation';
import React, { FC, useState } from 'react'

const ResetPassword: FC<{ token: string }> = ({ token }) => {

    const [password, setPassword] = useState("")
    const [isPasswordCheck, setIsPasswordCheck] = useState<boolean>(false)

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await changeForgotPassword(password, token)
            setPassword("")
            router.push('/login')
        } catch (error: any) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };
  
    if (isLoading) {
        return (
            <Loading />
        )
    }

    return (
        <div className="rounded-lg shadow-lg">
            <div className="max-w-4xl mx-auto font-[sans-serif] rounded-lg shadow-lg ">
                <div className="max-w-4xl w-full rounded-lg shadow-lg">

                    <div className="p-8 rounded-2xl bg-blue-100 shadow-lg">
                        <h2 className="text-gray-800 text-center text-2xl font-bold" >Password Reset</h2>
                        <form onSubmit={handleSubmit} className="mt-8 space-y-4" >
                            <div>
                                <label className="text-gray-800 text-sm mb-2 block">Password</label>
                                <div className="relative flex items-center">
                                    <input name="password" type={isPasswordCheck ? 'text' : 'password'} required={true} className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600" placeholder="Enter password" value={password} onChange={(e)=>{setPassword(e.target.value)}} />

                                    {
                                        !isPasswordCheck && <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-4 h-4 absolute right-4 cursor-pointer" viewBox="0 0 128 128" onClick={() => setIsPasswordCheck(true)}>
                                            <path d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z" data-original="#000000"></path>
                                        </svg>
                                    }

                                    {
                                        isPasswordCheck && <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-4 h-4 absolute right-4 cursor-pointer" width="800px" height="800px" viewBox="0 0 64 64" enableBackground="new 0 0 64 64" onClick={() => setIsPasswordCheck(false)}>
                                            <path fill="none" stroke="#000000" strokeWidth="2" strokeMiterlimit="10" d="M1,32c0,0,11,15,31,15s31-15,31-15S52,17,32,17S1,32,1,32z" />
                                            <circle fill="none" stroke="#000000" strokeWidth="2" strokeMiterlimit="10" cx="32" cy="32" r="7" />
                                            <line fill="none" stroke="#000000" strokeWidth="2" strokeMiterlimit="10" x1="9" y1="55" x2="55" y2="9" />
                                        </svg>
                                    }
                                </div>
                            </div>
                            <div className="!mt-8">
                                <button type="submit" className="w-full py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
                                    Change Password
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword