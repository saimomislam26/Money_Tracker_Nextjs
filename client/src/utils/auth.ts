import { AppDispatch } from "@/redux/store/store";
import Cookies from 'js-cookie'
import { decodeToken } from "./decodedToken";
import { setUserInfo } from "@/redux/slices/userSlice";

export const loadUserFromCookies = (dispatch: AppDispatch) => {
    const token = Cookies.get('token');
    if (token) {
        const userInfo = decodeToken(token);
        if (userInfo) {
            dispatch(setUserInfo(userInfo));
        }
    }
};