import type { TypedUseSelectorHook } from 'react-redux';
import { useSelector } from 'react-redux';
import type { StateType } from '../state';

export const useStateSelector: TypedUseSelectorHook<StateType> = useSelector;
