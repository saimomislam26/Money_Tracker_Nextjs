
import { configureStore } from '@reduxjs/toolkit';
import categoryReducer from '@/redux/slices/categorySlice';
import userReducer from '@/redux/slices/userSlice'
import authMiddleware from '../middleware/authMiddleware';

export const store = configureStore({
  reducer: {
    category:categoryReducer,
    user:userReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authMiddleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
