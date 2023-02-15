import Toast from 'react-native-simple-toast';
import { useDispatch } from 'react-redux';
import { setAuthInfo } from '../store/feature/userSlice';
import { postMembersLogout } from '../api/user';
import { useEffect } from 'react';
import RootNavigation from '../RootNavigation';
import authStorage from '../config/authStorage';
import store from '../store';
import { initDeviceSlice } from '../store/feature/deviceSlice';
import { initUserSlice } from '../store/feature/userSlice';
import { initAlertSlice } from '../store/feature/alertSlice';
import { initGroupSlice } from '../store/feature/groupSlice';
import { initReviewSlice } from '../store/feature/reviewSlice';

export const logout = async (userForceLogout = false) => {
  await postMembersLogout();
  await authStorage.removeUser();
  store.dispatch(setAuthInfo(null));
  store.dispatch(initUserSlice());
  store.dispatch(initDeviceSlice());
  store.dispatch(initAlertSlice());
  store.dispatch(initGroupSlice());
  store.dispatch(initReviewSlice());
  if (!userForceLogout) {
    Toast.showWithGravity(
      '로그인 유지 시간이 만료되었습니다.\n다시 로그인 해주세요',
      Toast.SHORT,
      Toast.TOP,
      ['RCTModalHostViewController'],
    );
  }
  // RootNavigation.navigate('IntroScreen', {});
  RootNavigation.reset([{ name: 'IntroScreen' }]);
};
