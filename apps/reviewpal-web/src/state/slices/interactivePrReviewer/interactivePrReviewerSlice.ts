import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type {
  AddPrCommentArgsType,
  InitiateNextDiscussionTurnType,
  MovePrCommentArgsType,
  UpdatePrCommentArgsType,
} from '@reviewpal/web/state';
import {
  CurrentReviewerSliceName,
  discussPrInteractivelyAsync,
  InteractivePrReviewerState,
  publishPrCommentAsync,
  reviewPrInteractivelyAsync,
} from '@reviewpal/web/state';

export const interactivePrReviewerSlice = createSlice({
  name: CurrentReviewerSliceName,
  initialState: InteractivePrReviewerState.createInitialState(),
  reducers: {
    addPrComment: (state, { payload }: PayloadAction<AddPrCommentArgsType>) =>
      new InteractivePrReviewerState(state).addComment(payload),
    updatePrComment: (state, { payload }: PayloadAction<UpdatePrCommentArgsType>) =>
      new InteractivePrReviewerState(state).updateComment(payload),
    deletePrComment: (state, { payload }: PayloadAction<string>) =>
      new InteractivePrReviewerState(state).deleteComment(payload),
    movePrComment: (state, { payload }: PayloadAction<MovePrCommentArgsType>) =>
      new InteractivePrReviewerState(state).moveComment(payload),
    initiateNextDiscussionTurn: (state, { payload }: PayloadAction<InitiateNextDiscussionTurnType>) =>
      new InteractivePrReviewerState(state).initiateNextDiscussionTurn(payload),
    startOverDiscussion: (state, { payload }: PayloadAction<string>) =>
      new InteractivePrReviewerState(state).startOverDiscussion(payload),
  },
  extraReducers: (builder) => {
    builder.addCase(reviewPrInteractivelyAsync.pending, () => InteractivePrReviewerState.createInitialState());
    builder.addCase(reviewPrInteractivelyAsync.fulfilled, (state, { payload, meta: { arg } }) =>
      new InteractivePrReviewerState(state).applyReviewResult(payload, arg)
    );
    builder.addCase(discussPrInteractivelyAsync.fulfilled, (state, { payload }) =>
      new InteractivePrReviewerState(state).applyDiscussionResult(payload)
    );
    builder.addCase(publishPrCommentAsync.fulfilled, (state, { meta: { arg } }) =>
      new InteractivePrReviewerState(state).markCommentAsPublished(arg.commentId)
    );
  },
});

export const interactivePrReviewerReducer = interactivePrReviewerSlice.reducer;
export const {
  addPrComment,
  updatePrComment,
  deletePrComment,
  movePrComment,
  initiateNextDiscussionTurn,
  startOverDiscussion,
} = interactivePrReviewerSlice.actions;
