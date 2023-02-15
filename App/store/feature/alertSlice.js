import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  toastText: '',
  alartJSON: {},
  isNewAlarm: false,
};

export const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    initAlertSlice: (state) => {
      state = initialState;
    },
    setToast: (state, action) => {
      console.log('state.ToastText:: ', state.toastText);
    },
    setAlertData: (state, action) => {
      state.alartJSON = action.payload;
    },
    setIsNewAlarm: (state, action) => {
      state.isNewAlarm = action.payload;
    },
  },
});

export const { setToast, setAlertData, setIsNewAlarm, initAlertSlice } =
  alertSlice.actions;

export default alertSlice.reducer;
