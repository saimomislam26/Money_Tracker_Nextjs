'use client'
import { useEffect } from 'react';
import { useAppDispatch } from '@/redux/store/hooks';  // Use the typed dispatch
import { fetchUserInfo } from '@/redux/slices/userSlice';

export default function FetchUserInfo() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUserInfo());
  }, [dispatch]);

  return null;  // This component doesn't need to render anything
}
