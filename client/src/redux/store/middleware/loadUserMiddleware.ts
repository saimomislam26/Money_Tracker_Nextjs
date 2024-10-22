import { AnyAction, Middleware } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { clearUserInfo, setUserInfo } from '@/redux/slices/userSlice';
import { decodeToken } from '@/utils/decodedToken';
import { useRouter } from 'next/router';
import { AppDispatch, RootState } from '../store';

// export const loadUserMiddleware: Middleware = storeAPI => next => (action) => {

//     // if ((action as { type: string }).type === 'user/initializeAuth' || ((action as { type: string }).type === '@@INIT')) {
//     //     const token = Cookies.get('token');

//     //     if (token) {
//     //         const userInfo = decodeToken(token);
//     //         if (userInfo) {
//     //             storeAPI.dispatch(setUserInfo(userInfo));
//     //         }
//     //     } else {
//     //         storeAPI.dispatch(clearUserInfo());
//     //     }
//     // }


//     // return next(action);
// };


export const routerMiddleware = (store: { getState: () => RootState; dispatch: AppDispatch }) => 
    (next: (action: AnyAction) => void) => 
    (action: AnyAction) => {
      const router = useRouter();
      return next({
        ...action,
        meta: { ...action.meta, router },
      });
  };