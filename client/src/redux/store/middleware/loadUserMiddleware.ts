import { Middleware } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { clearUserInfo, setUserInfo } from '@/redux/slices/userSlice';
import { decodeToken } from '@/utils/decodedToken';

export const loadUserMiddleware: Middleware = storeAPI => next => (action) => {

    if ((action as { type: string }).type === 'user/initializeAuth' || ((action as { type: string }).type === '@@INIT')) {
        const token = Cookies.get('token');

        if (token) {
            const userInfo = decodeToken(token);
            if (userInfo) {
                storeAPI.dispatch(setUserInfo(userInfo));
            }
        } else {
            storeAPI.dispatch(clearUserInfo());
        }
    }


    return next(action);
};