import { createSlice } from '@reduxjs/toolkit';
import updateSameText from '../../function/updateSameText';

const initialState = {
  fcmToken: '',
  fcmMessage: undefined,
};

export const deviceSlice = createSlice({
  name: 'device',
  initialState,
  reducers: {
    initDeviceSlice: (state) => {
      state = initialState;
    },
    setFcmToken: (state, action) => {
      state.fcmToken = action.payload;
    },
    removeFcmToken: (state, action) => {
      state.fcmToken = '';
    },
    setFcmMessage: (state, action) => {
      state.fcmMessage = action.payload;
    },
  },
});

export const { setFcmToken, setFcmMessage, initDeviceSlice } =
  deviceSlice.actions;

export default deviceSlice.reducer;
