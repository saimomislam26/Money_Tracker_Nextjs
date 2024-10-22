// import { Middleware } from '@reduxjs/toolkit';
// import Cookies from 'js-cookie';
// import { clearUserInfo, setUserInfo } from '@/redux/slices/userSlice';
// import { getUserInfo } from '@/lib/api';

// export const loadUserMiddleware: Middleware = storeAPI => next => async (action) => {

//     if ((action as { type: string }).type === 'user/initializeAuth' || ((action as { type: string }).type === '@@INIT')) {

//         const token = Cookies.get('token');
//         console.log(token);

//         if (token) {
//             const userInfo = await getUserInfo();
            

//             if (userInfo) {
//                 storeAPI.dispatch(setUserInfo(userInfo));
//             }
//         } else {
//             storeAPI.dispatch(clearUserInfo());
//         }
//     }

//     return next(action);
// };