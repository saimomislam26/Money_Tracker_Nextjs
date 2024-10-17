// src/store/counterSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    _id: string | null
    firstName: string
    lastName: string
    email: string
    income: number,
}

const initialState: UserState = {
    _id: null,
    firstName: "",
    lastName: "",
    email: "",
    income: 0
};

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
            state.email = "";
            state.income = 0;
            state.firstName = "";
            state.lastName = ""
        },
    },
});

export const { setUserInfo, clearUserInfo } = userSlice.actions;

export default userSlice.reducer;