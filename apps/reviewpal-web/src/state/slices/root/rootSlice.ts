import { createSlice } from '@reduxjs/toolkit';
import {
  authorizeWithPasswordAsync,
  initializeRootAsync,
  logoutAsync,
  RootSliceName,
  RootState,
} from '@reviewpal/web/state';

export const rootSlice = createSlice({
  name: RootSliceName,
  initialState: RootState.createInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(initializeRootAsync.pending, (state) => new RootState(state).startLoading());
    builder.addCase(initializeRootAsync.fulfilled, (state, { payload }) => new RootState(state).finishLoading(payload));
    builder.addCase(initializeRootAsync.rejected, (state, { error }) =>
      new RootState(state).failLoading(error.message)
    );
    builder.addCase(authorizeWithPasswordAsync.fulfilled, (state, { payload }) =>
      new RootState(state).setCurrentUser(payload)
    );
    builder.addCase(logoutAsync.fulfilled, (state) => new RootState(state).setCurrentUser(undefined));
  },
});

export const rootReducer = rootSlice.reducer;
