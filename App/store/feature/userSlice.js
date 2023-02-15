import { createSlice } from '@reduxjs/toolkit';
import authStorage from '../../config/authStorage';

const initialState = {
  authInfo: null,
  phone: null,
  requestedNewToken: false,
  terms: {
    terms: false,
    collect: false,
    gps: false,
    marketing: false,
    alarm: false,
  },
  tempProfileImage: null,
  ids: {
    groupId: undefined,
    reviewId: undefined,
    dailyId: undefined,
    groupName: undefined,
  },
  nowPage: 'review_post',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    initUserSlice: (state) => {
      state = initialState;
    },
    setAuthInfo: (state, action) => {
      const data = action.payload;
      if (data?.MID) {
        state.authInfo = { ...data };
        authStorage.storeUser({ ...data });
      }
    },
    setRequestedNewToken: (state, action) => {
      state.requestedNewToken = action.payload;
    },
    setPhone: (state, action) => {
      state.phone = action.payload;
    },
    setTerms: (state, action) => {
      state.terms = action.payload;
    },
    setTempProfileImage: (state, action) => {
      state.tempProfileImage = action.payload;
    },
    setIds: (state, action) => {
      if (typeof action.payload?.groupId === 'string') {
        state.ids = action.payload;
      }
    },
    setNowPage: (state, action) => {
      state.nowPage = action.payload;
    },
    setUserSliceInit: (state) => {
      state = Object.assign({}, initialState);
    },
  },
});

export const {
  setAuthInfo,
  setRequestedNewToken,
  setPhone,
  setTerms,
  setTempProfileImage,
  setIds,
  setNowPage,
  setUserSliceInit,
  initUserSlice,
} = userSlice.actions;

export default userSlice.reducer;
