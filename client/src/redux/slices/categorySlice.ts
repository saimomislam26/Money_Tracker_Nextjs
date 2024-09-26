// src/store/counterSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CategoryState {
  selectedCategory: Array<{ category: string, name: string }>;
}

const initialState: CategoryState = {
  selectedCategory: [],
};

export const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setSelectedCategory(state, action: PayloadAction<{ category: string, name: string }>) {
      state.selectedCategory.push(action.payload)
    },
    filterSelectedCategory(state, action: PayloadAction<{categoryId:string}>) {
      state.selectedCategory = state.selectedCategory.filter(category => category.category !== action.payload.categoryId)
    }
  },
});

export const { setSelectedCategory, filterSelectedCategory } = categorySlice.actions;

export default categorySlice.reducer;