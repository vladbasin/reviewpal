import { createSlice } from '@reduxjs/toolkit';
import { CurrentReviewerSliceName, CurrentReviewerState, loadReviewerAsync } from '@reviewpal/web/state';

export const currentReviewerSlice = createSlice({
  name: CurrentReviewerSliceName,
  initialState: CurrentReviewerState.createInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadReviewerAsync.fulfilled, (state, { payload }) =>
      new CurrentReviewerState(state).finishLoading(payload)
    );
    builder.addCase(loadReviewerAsync.rejected, (state, { error }) =>
      new CurrentReviewerState(state).failLoading(error.message)
    );
    builder.addCase(loadReviewerAsync.pending, (state) => new CurrentReviewerState(state).startLoading());
  },
});

export const currentReviewerReducer = currentReviewerSlice.reducer;
