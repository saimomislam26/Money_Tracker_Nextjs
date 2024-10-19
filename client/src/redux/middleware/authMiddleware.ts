import { Middleware } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { setUserInfo, } from '@/redux/slices/userSlice';
import { decodeToken } from '@/utils/decodedToken';

const authMiddleware:Middleware = (store) => (next) => (action) => {
  if (action.type === 'user/initializeAuth' || action.type === '@@INIT') {
    const token = Cookies.get('token');

    if (token) {
        const userInfo = decodeToken(token);
        console.log("From Middleware", userInfo);
        
        if (userInfo) {
            store.dispatch(setUserInfo(userInfo));
        }
    }
  }

  return next(action);
};

export default authMiddleware;

