// utils/decodeToken.ts
import { jwtDecode } from "jwt-decode";

interface UserInfo {
  _id: string;
  firstName:string,
  lastName:string,
  email: string;
  income: number | null;
  iat:number,
  exp:number
}

export const decodeToken = (token: string): UserInfo | null => {
    try {
      const decoded: UserInfo = jwtDecode<UserInfo>(token); 
      return decoded;
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }
  };
