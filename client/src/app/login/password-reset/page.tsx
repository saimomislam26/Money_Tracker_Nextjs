import React from 'react'

import { Metadata } from 'next';
import Resetform from './Resetform';

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Reset Password to Ayebya',
};

const page = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-white dark:bg-gray-900 text-black dark:text-white">
    <Resetform />
  </div>
  )
}


export default page