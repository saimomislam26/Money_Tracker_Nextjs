'use client'
import Loading from '@/components/Loading';
import { passwordResetRequest } from '@/lib/api';
import React, { useState } from 'react'

const Resetform = () => {
  const [email, setEmail] = useState("")
  
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setIsLoading(true);
      // const { email, password } = userLoginInfo
      try {
          await passwordResetRequest(email);
          setEmail("")
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
                              <label className="text-gray-800 text-sm mb-2 block">Email</label>
                              <div className="relative flex items-center">
                                  <input required={true} name="email" type="text" className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600" placeholder="Enter your email" value={email} onChange={(e)=>{setEmail(e.target.value)}} />
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-4 h-4 absolute right-4" viewBox="0 0 24 24">
                                      <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                                      <path d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z" data-original="#000000"></path>
                                  </svg>
                              </div>
                          </div>
                          <div className="!mt-8">
                              <button type="submit" className="w-full py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
                                  Get Reset Link
                              </button>
                          </div>
      
                      </form>
                  </div>
              </div>
          </div>
      </div>
  )
}

export default Resetform