import { Middleware } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { initUserFromCookies, setUserInfo } from '@/redux/slices/userSlice';
import {decodeToken} from '@/utils/decodedToken';

export const loadUserMiddleware: Middleware = storeAPI => next => action => {
    if ((action as { type: string }).type === initUserFromCookies.type) {
        const token = Cookies.get('token');
        console.log("From Middleware", token);
        if (token) {
            const userInfo = decodeToken(token);
            console.log("From Middleware", userInfo);
            
            if (userInfo) {
                storeAPI.dispatch(setUserInfo(userInfo));
            }
        }
    }
    return next(action);
};