// src/store/counterSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CategoryState {
  allCategories: Array<{ _id: string, name: string }>,
  selectedCategory: Array<{ category: string, name: string, amount?: number }>;
}

interface SetAllCategoriesAfterDeletePayload {
  afterDeletedAllCategory: Array<{ _id: string, name: string }>;
  categoryId: string;
}

const initialState: CategoryState = {
  allCategories: [],
  selectedCategory: [],
};

export const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setAllCategories(state, action: PayloadAction<{ _id: string, name: string }>) {
      state.allCategories.push(action.payload)
    },
    setAllCategoriesAfterDelete(state, action: PayloadAction<SetAllCategoriesAfterDeletePayload>) {
      state.allCategories = action.payload.afterDeletedAllCategory
      state.selectedCategory = state.selectedCategory.filter(category => category.category !== action.payload.categoryId)
    },
    setCategoriesWithAmount(state, action: PayloadAction<{categoryId: string, amount: number}>) {
      const indexNo = state.selectedCategory.findIndex(val => val.category === action.payload.categoryId)
      state.selectedCategory[indexNo].amount = action.payload.amount
    },
    setInitialCategoriesFetch(state, action: PayloadAction<Array<{ _id: string, name: string }>>) {
      state.allCategories = action.payload
    },
    setSelectedCategory(state, action: PayloadAction<{ category: string, name: string }>) {
      state.selectedCategory.push(action.payload)
    },
    filterSelectedCategory(state, action: PayloadAction<{ categoryId: string }>) {
      state.selectedCategory = state.selectedCategory.filter(category => category.category !== action.payload.categoryId)
    }
  },
});

export const { setSelectedCategory, filterSelectedCategory, setAllCategories, setAllCategoriesAfterDelete, setInitialCategoriesFetch, setCategoriesWithAmount } = categorySlice.actions;

export default categorySlice.reducer;