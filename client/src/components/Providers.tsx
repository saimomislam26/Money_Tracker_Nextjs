'use client';

import { fetchUserInfo } from '@/redux/slices/userSlice';
import { useAppDispatch } from '@/redux/store/hooks';
import { store } from '@/redux/store/store';
import { ReactNode, useEffect } from 'react';
import { Provider } from 'react-redux';


export default function Providers({ children }: { children: ReactNode }) {

  return <Provider store={store}>{children}</Provider>;
}
