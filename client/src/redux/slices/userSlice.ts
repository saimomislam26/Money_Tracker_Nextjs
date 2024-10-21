// src/store/counterSlice.ts
import { getUserInfo } from '@/lib/api';
import { createAction, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

// Redux thunk to call  fetch user info before rendering
export const fetchUserInfo = createAsyncThunk(
    'user/fetchUserInfo',
    async (_, thunkAPI) => {
      try {
        const userInfo = await getUserInfo();
        return userInfo;
      } catch (error) {
        return thunkAPI.rejectWithValue('Failed to fetch user info');
      }
    }
  );

interface UserState {
    _id: string | null
    firstName: string
    lastName: string
    email: string
    income: number | null,
    currentMonthIncome: number | null,
    status?: 'idle' | 'loading' | 'succeeded' | 'failed';
    error?: string | null;
}

const initialState: UserState = {
    _id: null,
    firstName: "",
    lastName: "",
    email: "",
    income: 0,
    currentMonthIncome: null,
    status: 'idle',
    error: null,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserInfo(state, action: PayloadAction<UserState>) {
            state._id = action.payload._id;
            state.email = action.payload.email;
            state.income = action.payload.income;
            state.currentMonthIncome = action.payload.currentMonthIncome;
            state.firstName = action.payload.firstName;
            state.lastName = action.payload.lastName
        },
        clearUserInfo(state) {
            state._id = null;
            state.email = "";
            state.income = 0;
            state.currentMonthIncome = null;
            state.firstName = "";
            state.lastName = ""
        }
    },
    extraReducers: (builder) => {
        builder
          .addCase(fetchUserInfo.pending, (state) => {
            state.status = 'loading';
          })
          .addCase(fetchUserInfo.fulfilled, (state, action: PayloadAction<UserState>) => {
            state.status = 'succeeded';
            state._id = action.payload._id;
            state.email = action.payload.email;
            state.income = action.payload.income;
            state.currentMonthIncome = action.payload.currentMonthIncome;
            state.firstName = action.payload.firstName;
            state.lastName = action.payload.lastName;
          })
          .addCase(fetchUserInfo.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload as string;
          });
      },
});

export const { setUserInfo, clearUserInfo } = userSlice.actions;

export default userSlice.reducer;