'use client'
import { useEffect } from 'react';
import { useAppDispatch } from '@/redux/store/hooks';  // Use the typed dispatch
import { fetchUserInfo } from '@/redux/slices/userSlice';
import { usePathname } from 'next/navigation';

export default function FetchUserInfo() {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  useEffect(() => {

    if (pathname !== '/login' && pathname !== '/register') {
      dispatch(fetchUserInfo());
    }
  }, [dispatch, pathname]);

  return null; 
}
