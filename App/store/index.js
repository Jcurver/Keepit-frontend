import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import deviceSlice from './feature/deviceSlice';
import groupSlice from './feature/groupSlice';
import reviewSlice from './feature/reviewSlice';
import userSlice from './feature/userSlice';
import alertSlice from './feature/alertSlice';

export const store = configureStore({
  reducer: {
    user: userSlice,
    group: groupSlice,
    review: reviewSlice,
    device: deviceSlice,
    alert: alertSlice,
  },
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
});

export default store;
