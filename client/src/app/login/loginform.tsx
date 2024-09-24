'use client';

import Loading from '@/components/Loading';
import { loginUser } from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, useState } from 'react'

const Loginform = () => {
    const [userLoginInfo, setUserLoginInfo] = useState({
        email: "",
        password: ""
    })
    const router = useRouter()
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isPasswordCheck, setIsPasswordCheck] = useState<boolean>(false)

    const handleUserLoginInfo = (e: ChangeEvent<HTMLInputElement>) => {
        let name
        let value

        name = e.target.name
        value = e.target.value

        setUserLoginInfo({ ...userLoginInfo, [name]: value })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const { email, password } = userLoginInfo
        try {
            await loginUser({ email, password });
            setUserLoginInfo({
                email: "",
                password: ""
            })
            router.push("/")
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
                        <h2 className="text-gray-800 text-center text-2xl font-bold" >Sign in</h2>
                        <form className="mt-8 space-y-4" >
                            <div>
                                <label className="text-gray-800 text-sm mb-2 block">User name</label>
                                <div className="relative flex items-center">
                                    <input required={true} name="email" type="text" className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600" placeholder="Enter user name" value={userLoginInfo.email} onChange={handleUserLoginInfo} />
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-4 h-4 absolute right-4" viewBox="0 0 24 24">
                                        <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                                        <path d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z" data-original="#000000"></path>
                                    </svg>
                                </div>
                            </div>

                            <div>
                                <label className="text-gray-800 text-sm mb-2 block">Password</label>
                                <div className="relative flex items-center">
                                    <input name="password" type={isPasswordCheck ? 'text' : 'password'} required={true} className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600" placeholder="Enter password" value={userLoginInfo.password} onChange={handleUserLoginInfo} />

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

                            {/* <div className="flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center">
                                    <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                                    <label htmlFor="remember-me" className="ml-3 block text-sm text-gray-800">
                                        Remember me
                                    </label>
                                </div>
                                <div className="text-sm">
                                    <a href="jajvascript:void(0);" className="text-blue-600 hover:underline font-semibold">
                                        Forgot your password?
                                    </a>
                                </div>
                            </div> */}

                            <div className="!mt-8">
                                <button type="submit" className="w-full py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none" onClick={handleSubmit}>
                                    Sign in
                                </button>
                            </div>
                            <p className="text-gray-800 text-sm !mt-8 text-center">Don't have an account? <Link href="/register" className="text-blue-600 hover:underline ml-1 whitespace-nowrap font-semibold">Register here</Link></p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Loginform