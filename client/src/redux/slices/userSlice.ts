// src/store/counterSlice.ts
import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    _id: string | null
    firstName: string | null
    lastName: string | null
    email: string | null
    income: number | null,
}

const initialState: UserState = {
    _id: null,
    firstName: null,
    lastName: null,
    email: null,
    income: null
};

export const initUserFromCookies = createAction('user/initUserFromCookies');

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserInfo(state, action: PayloadAction<UserState>) {
            state._id = action.payload._id;
            state.email = action.payload.email;
            state.income = action.payload.income;
            state.firstName = action.payload.firstName;
            state.lastName = action.payload.lastName
        },
        clearUserInfo(state) {
            state._id = null;
            state.email = null;
            state.income = null;
            state.firstName = null;
            state.lastName = null
        },
    },
});

export const { setUserInfo, clearUserInfo } = userSlice.actions;

export default userSlice.reducer;