'use client';

import Loading from "@/components/Loading";
import { registerUser } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";

const RegisterForm = () => {
    const router = useRouter()
    const [userInfo, setUserInfo] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    })
    const [isLoading, setIsLoading] = useState(false);

    const handleRegisterInfo = (e: ChangeEvent<HTMLInputElement>) => {
        let name
        let value

        name = e.target.name
        value = e.target.value

        setUserInfo({ ...userInfo, [name]: value })
    }


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const { firstName, lastName, email, password } = userInfo
        try {
            await registerUser({ firstName, lastName, email, password });
            setUserInfo({
                firstName: "",
                lastName: "",
                email: "",
                password: ""
            })
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
        <>
            <div className="max-w-4xl mx-auto font-[sans-serif] p-6  rounded-lg shadow-lg bg-blue-100 ">
                <div className="text-center mb-16">
                    <h4 className="text-gray-800 text-base font-semibold mt-6">Sign up into your account</h4>
                </div>

                <form>
                    <div className="grid sm:grid-cols-2 gap-8">
                        <div>
                            <label className="text-gray-800 text-sm mb-2 block">First Name</label>
                            <input name="firstName" type="text" className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all" placeholder="Enter name" value={userInfo.firstName} onChange={handleRegisterInfo} />
                        </div>
                        <div>
                            <label className="text-gray-800 text-sm mb-2 block">Last Name</label>
                            <input name="lastName" type="text" className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all" placeholder="Enter last name" value={userInfo.lastName} onChange={handleRegisterInfo} />
                        </div>
                        <div>
                            <label className="text-gray-800 text-sm mb-2 block">Email Id</label>
                            <input name="email" type="text" className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all" placeholder="Enter email" value={userInfo.email} onChange={handleRegisterInfo} />
                        </div>
                        <div>
                            <label className="text-gray-800 text-sm mb-2 block">Password</label>
                            <input name="password" type="password" className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all" placeholder="Enter password" value={userInfo.password} onChange={handleRegisterInfo} />
                        </div>

                    </div>

                    <div className="!mt-12">
                        <button type="button" className="py-3.5 px-7 text-sm font-semibold tracking-wider rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none" onClick={handleSubmit}>
                            Sign up
                        </button>
                    </div>

                    <p className="text-gray-800 text-sm !mt-8 text-center">Already have an account? <Link href="/login" className="text-blue-600 hover:underline ml-1 whitespace-nowrap font-semibold">Login here</Link></p>
                </form>
            </div>
        </>
    )
}

export default RegisterForm