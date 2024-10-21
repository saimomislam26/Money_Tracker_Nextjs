import { useDispatch } from 'react-redux';
import type { AppDispatch } from './store';

// Typed version of useDispatch
// To cal thunk function need to make this custom hook
export const useAppDispatch = () => useDispatch<AppDispatch>();