import { useDispatch } from 'react-redux';
import type { StateDispatchType } from '../state';

export const useStateDispatch: () => StateDispatchType = useDispatch;
