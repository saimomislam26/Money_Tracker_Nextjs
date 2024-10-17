'use client';

import { store } from '@/redux/store/store';
import { ReactNode, useEffect } from 'react';
import { Provider } from 'react-redux';

export default function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    store.dispatch({ type: 'user/initializeAuth' });
  }, []);
  return <Provider store={store}>{children}</Provider>;
}
