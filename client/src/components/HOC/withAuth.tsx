"use client"
import { useRouter } from 'next/navigation';
import { ComponentType, useEffect } from 'react';

const withAuth =  <P extends object>(WrappedComponent: ComponentType<P>) => {
  return (props:P) => {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        // Redirect to login if no token is found
        router.push('/login');
      }
    }, [router]);

    // Render only if the token exists
    return localStorage.getItem('token') ? <WrappedComponent {...props} /> : null;
  };
};

export default withAuth;
