import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  searchWordList: [],
  groupList: [],

  groupReviewRefresh: [],
  groupDailyRefresh: [],
  groupUserReviewRefresh: {},
  groupUserDailyRefresh: {},
  groupToast: false,
  groupNavigate: false,
  mapGroup: null,
  mapRefresh: true,
  mapData: null,
};

export const groupSlice = createSlice({
  name: 'group',
  initialState,
  reducers: {
    initGroupSlice: (state) => {
      state = initialState;
    },
    setGroupList: (state, action) => {
      state.groupList = action.payload;
    },
    // 최근 검색어 리스트에 저장
    saveSearchWordList: (state, action) => {
      const value = action.payload[0];
      const sub = action.payload[1];
      const filter = state.searchWordList.filter((list) => list !== value);
      const list = [value, ...filter];
      state.searchWordList = list;

      try {
        AsyncStorage.setItem('search' + sub, JSON.stringify(list));
      } catch (error) {
        console.log('error storing search word list', error);
      }
    },
    // 최근 검색어 리스트 설정하기
    setSearchWordList: (state, action) => {
      if (action.payload === null) {
        state.searchWordList = [];
      } else {
        state.searchWordList = action.payload;
      }
    },
    // 최근 검색어 리스트에서 특정 검색어 삭제
    deleteSearchWordList: (state, action) => {
      const value = action.payload[0];
      const sub = action.payload[1];
      const filter = state.searchWordList.filter((list) => list !== value);
      state.searchWordList = filter;

      try {
        AsyncStorage.setItem('search' + sub, JSON.stringify(filter));
      } catch (error) {
        console.log('error deleting search word list', error);
      }
    },
    // 최근 검색어 리스트 전체 삭제
    removeSearchWordList: (state, action) => {
      const sub = action.payload;
      state.searchWordList = [];

      try {
        AsyncStorage.setItem('search' + sub, JSON.stringify([]));
      } catch (error) {
        console.log('error deleting search word list', error);
      }
    },
    setGroupSliceInit: (state) => {
      state = Object.assign({}, initialState);
    },
    setGroupToast: (state, action) => {
      state.groupToast = action.payload;
    },
    setGroupNavigate: (state, action) => {
      state.groupNavigate = action.payload;
    },
    setMapGroup: (state, action) => {
      state.mapGroup = action.payload;
    },
    setMapRefresh: (state, action) => {
      state.mapRefresh = action.payload;
    },
    setMapData: (state, action) => {
      state.mapData = action.payload;
    },
  },
});

export const {
  setGroupList,
  saveSearchWordList,
  setSearchWordList,
  deleteSearchWordList,
  removeSearchWordList,
  setGroupSliceInit,
  setGroupToast,
  setGroupNavigate,
  setMapGroup,
  setMapRefresh,
  setMapData,
  initGroupSlice,
} = groupSlice.actions;

export default groupSlice.reducer;
