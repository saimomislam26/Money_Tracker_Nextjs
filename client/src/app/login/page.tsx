import React from 'react'
import Loginform from './loginform'

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to Money Tracker system',
};

const page = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-white dark:bg-gray-900 text-black dark:text-white">
    <Loginform />
  </div>
  )
}


export default page