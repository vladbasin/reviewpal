import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { rootReducer, currentReviewerReducer, interactivePrReviewerReducer } from './slices';

export const createRootStateReducer = () =>
  combineReducers({
    root: rootReducer,
    currentReviewer: currentReviewerReducer,
    interactivePrReviewer: interactivePrReviewerReducer,
  });

export const state = configureStore({
  reducer: createRootStateReducer(),
});

export const createStateSelector = createSelector.withTypes<StateType>();

export type StateType = ReturnType<typeof state.getState>;
export type StateSelectorType<TResult> = (state: StateType) => TResult;
export type StateDispatchType = typeof state.dispatch;
