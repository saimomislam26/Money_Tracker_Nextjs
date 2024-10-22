// src/store/counterSlice.ts
import { getUserInfo } from '@/lib/api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store/store';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { NextRouter } from 'next/router';

// ;extra: { router: NextRouter }
// Redux thunk to call  fetch user info before rendering
export const fetchUserInfo = createAsyncThunk<
  UserState, // Adjust this type to match the expected return value
  void, // The first argument is the input to the thunk, which is void in this case
  { state: RootState } // Specify the state type
>(
  'user/fetchUserInfo',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();

    if (state.user.isFetching) {
      return; // Prevent multiple fetches
    }

    thunkAPI.dispatch(userSlice.actions.setFetching(true));
    try {
      const userInfo = await getUserInfo();
      // console.log({ userInfo });

      return userInfo;
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to fetch user info');
    } finally {
      thunkAPI.dispatch(userSlice.actions.setFetching(false)); // Reset fetching to false
    }
  }
);

interface UserState {
  _id?: string | null
  firstName: string
  lastName: string
  email: string
  income: number | null,
  currentMonthIncome: number | null,
  status?: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string | null;
  isFetching?: false,
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

console.log("User Slice",initialState );


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
    },
    setFetching(state, action) {
      state.isFetching = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserInfo.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserInfo.fulfilled, (state, action: PayloadAction<UserState>) => {
        state.status = 'succeeded';
        state._id = action.payload?._id || null;
        state.email = action.payload?.email || "";
        state.income = action.payload?.income || 0;
        state.currentMonthIncome = action.payload?.currentMonthIncome || null;
        state.firstName = action.payload?.firstName || "";
        state.lastName = action.payload?.lastName || "";
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { setUserInfo, clearUserInfo } = userSlice.actions;

export default userSlice.reducer;