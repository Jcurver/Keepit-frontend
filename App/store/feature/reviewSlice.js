import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  submitButton: 'submit',
  commentList: [],
  commentTargetIndex: undefined,
  commentScrollIndex: undefined,
  loginMemberName: '',
  selectedCommentData: undefined,
  selectedCommentId: undefined,
  fromMap: false,
};
// 로그아웃시 모두 초기화하는 로직 구현해서 에러 방지할 예정
export const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {
    initReviewSlice: (state) => {
      state = initialState;
    },
    setFromMap: (state, action) => {
      state.fromMap = action.payload;
    },
    resetCommentData: (state) => {
      state.selectedCommentData = undefined;
    },
    setCommentData: (state, action) => {
      state.selectedCommentData = action.payload;
    },
    setLoginMemberName: (state, action) => {
      state.loginMemberName = action.payload;
    },
    setSubmitButtonState: (state, action) => {
      state.submitButton = action.payload;
    },
    setCommentList: (state, action) => {
      state.commentList = action.payload;
    },
    setNewComment: (state, action) => {
      state.commentList.push(action.payload);
      state.commentTargetIndex = undefined;
    },
    resetCommentTargetIndex: (state) => {
      state.commentTargetIndex = undefined;
    },
    setCommentTargetIndex: (state, action) => {
      state.commentTargetIndex = state.commentList.findIndex(
        ({ commentId }) => commentId === action.payload.commentData.commentId,
      );
      if (state.commentTargetIndex === -1) {
        let childIndex;
        for (let i = 0; i < state.commentList.length; i++) {
          if (state.commentList[i]?.childComments?.length) {
            childIndex = state.commentList[i].childComments.findIndex(
              ({ commentId }) =>
                commentId === action.payload.commentData.commentId,
            );
            if (childIndex !== undefined && childIndex !== -1) {
              state.commentTargetIndex = [i, childIndex];
              break;
            }
          }
        }
      }
    },
    setRemoveCommentTargetIndex: (state) => {
      state.commentTargetIndex = undefined;
    },
    setEditComment: (state, action) => {
      if (typeof state.commentTargetIndex === 'number') {
        state.commentList = [
          ...state.commentList.slice(0, state.commentTargetIndex),
          {
            ...state.commentList[state.commentTargetIndex],
            comment: action.payload.comment,
            imageUrl: action.payload.image,
          },
          ...state.commentList.slice(state.commentTargetIndex + 1),
        ];
      } else {
        state.commentList = state.commentList = [
          ...state.commentList.slice(0, state.commentTargetIndex[0]),
          {
            ...state.commentList[state.commentTargetIndex[0]],
            childComments: [
              ...state.commentList[
                state.commentTargetIndex[0]
              ].childComments.slice(0, state.commentTargetIndex[1]),
              {
                ...state.commentList[state.commentTargetIndex[0]].childComments[
                  state.commentTargetIndex[1]
                ],
                comment: action.payload.comment,
                imageUrl: action.payload.image,
              },
              ...state.commentList[
                state.commentTargetIndex[0]
              ].childComments.slice(state.commentTargetIndex[1] + 1),
            ],
          },
          ...state.commentList.slice(state.commentTargetIndex[0] + 1),
        ];
      }
    },
    setNestedComment: (state, action) => {
      // console.log(
      //   'state.commentList[state.commentTargetIndex]:: ',
      //   state.commentList[state.commentTargetIndex],
      //   state.commentList,
      //   state.commentTargetIndex,
      // );
      if (typeof state.commentTargetIndex === 'number') {
        if (
          state.commentList[state.commentTargetIndex]?.childComments ===
          undefined
        ) {
          state.commentList[state.commentTargetIndex] = Object.assign(
            state.commentList[state.commentTargetIndex],
            { childComments: [] },
          );
        }
        state.commentList = [
          ...state.commentList.slice(0, state.commentTargetIndex),
          {
            ...state.commentList[state.commentTargetIndex],
            childComments: [
              ...state.commentList[state.commentTargetIndex].childComments,
              action.payload,
            ],
          },
          ...state.commentList.slice(state.commentTargetIndex + 1),
        ];
      } else {
        // console.log(
        //   'state.commentList[state.commentTargetIndex[0]]:: ',
        //   state.commentList[state.commentTargetIndex[0]],
        //   state.commentTargetIndex[1],
        // );
        const targetName =
          state.commentList[state.commentTargetIndex[0]].childComments[
            state.commentTargetIndex[1]
          ].memberName;
        state.commentList = state.commentList = [
          ...state.commentList.slice(0, state.commentTargetIndex[0]),
          {
            ...state.commentList[state.commentTargetIndex[0]],
            childComments: [
              ...state.commentList[state.commentTargetIndex[0]].childComments,
              Object.assign(action.payload, { targetName }),
            ],
          },
          ...state.commentList.slice(state.commentTargetIndex[0] + 1),
        ];
      }
    },
    setReviewSliceInit: (state) => {
      state = Object.assign({}, initialState);
    },
    setSelectedCommentId: (state, action) => {
      state.selectedCommentId = action.payload;
    },
    setCommentScrollIndex: (state, action) => {
      state.commentScrollIndex = state.commentList.findIndex(
        ({ commentId }) => commentId === action.payload.commentData.commentId,
      );
      if (state.commentScrollIndex === -1) {
        let childIndex;
        for (let i = 0; i < state.commentList.length; i++) {
          if (state.commentList[i]?.childComments?.length) {
            childIndex = state.commentList[i].childComments.findIndex(
              ({ commentId }) =>
                commentId === action.payload.commentData.commentId,
            );
            if (childIndex !== undefined && childIndex !== -1) {
              state.commentScrollIndex = [i, childIndex];
              break;
            }
          }
        }
      }
    },
  },
});

export const {
  setFromMap,
  resetCommentData,
  setCommentData,
  setSubmitButtonState,
  setCommentList,
  setNewComment,
  setCommentTargetIndex,
  resetCommentTargetIndex,
  setRemoveCommentTargetIndex,
  setEditComment,
  setNestedComment,
  setLoginMemberName,
  setReviewSliceInit,
  setSelectedCommentId,
  setCommentScrollIndex,
  initReviewSlice,
} = reviewSlice.actions;

export default reviewSlice.reducer;
