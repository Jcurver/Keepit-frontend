import '../App/config/ignoreWarnings';
import React, { useEffect, useState, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigation from './RootNavigation';
import { Text, TextInput } from 'react-native';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './store';
import MainStack from './navigation/mainStack';
import authStorage from './config/authStorage';
import MainStackUnlogged from './navigation/mainStackUnlogged';
import SplashScreen from 'react-native-splash-screen';
import {
  callApi,
  checkAndUpdateAccessToken,
  checkAndUpdateRefreshToken,
} from './function/auth';

import messaging from '@react-native-firebase/messaging';
import { setFcmToken } from './store/feature/deviceSlice';
import { putMembersFcmToken } from './api/user';
import CodePush from 'react-native-code-push';
import { logout } from './function/logout';
import {
  ACCESS_REFRESH_TOKEN_EXPIRED,
  ACCESS_TOKEN_UPDATE_FAILED,
  REFRESH_TOKEN_EXPIRED,
  REFRESH_TOKEN_UPDATE_FAILED,
} from './constants/token';

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

const AppWrapper = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

const App = () => {
  const [loading, setLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const dispatch = useDispatch();
  const fcmToken = useSelector((state) => state.device.fcmToken);
  useEffect(() => {
    RootNavigation.isMountedRef.current = true;
    return () => (RootNavigation.isMountedRef.current = false);
  }, []);

  useEffect(() => {
    messaging().onNotificationOpenedApp((remoteMessage) => {
      if (remoteMessage) {
        RootNavigation.navigate('AlarmMainScreen', {
          backgroundAlarmData: remoteMessage?.data,
        });
      }
    });

    messaging()
      .getInitialNotification()
      .then((remoteMessage2) => {
        if (remoteMessage2) {
          RootNavigation.navigate('AlarmMainScreen', {
            backgroundAlarmData: remoteMessage2?.data,
          });
        }
        setLoading(false);
      });
  }, []);

  const getToken = useCallback(async () => {
    const myFcmToken = await messaging().getToken();
    dispatch(setFcmToken(myFcmToken));
  }, [dispatch]);
  getToken();
  // ????????? ???????????? ????????? ????????????????????? ????????? ???????????? ?????????.
  // 1????????? ???????????? ????????? ?????? ???????????? ??????????????????.
  useEffect(() => {
    const checkRefreshToken = setInterval(async () => {
      authStorage.retrieveUser().then(async (storedUser) => {
        if (Object.entries(storedUser).length !== 0) {
          const newRefreshToken = await checkAndUpdateRefreshToken(storedUser);
          // ?????? ???????????? ???????????????????????? ????????? ???????????? ?????????????????????.
          if (
            newRefreshToken === REFRESH_TOKEN_EXPIRED ||
            newRefreshToken === REFRESH_TOKEN_UPDATE_FAILED
          ) {
            console.log(newRefreshToken);
            await logout();
          }
        }
      });
    }, 12000);
    return () => clearInterval(checkRefreshToken);
  }, []);

  const getAccessTokenOnApp = useCallback(() => {
    authStorage.retrieveUser().then(async (storedUser) => {
      if (Object.entries(storedUser).length !== 0) {
        const newAccessToken = await checkAndUpdateAccessToken(storedUser);
        if (
          newAccessToken !== ACCESS_REFRESH_TOKEN_EXPIRED &&
          newAccessToken !== ACCESS_TOKEN_UPDATE_FAILED
        ) {
          setIsLogin(true);
        } else {
          logout();
        }
      }
    });
    // ????????? ???????????? ??????????????? 0.5??? ??? ?????? ????????????.
    // let hideSplash = setTimeout(() => {
    //   SplashScreen.hide();
    // }, 500);
    // return () => clearTimeout(hideSplash);
  }, []);
  getAccessTokenOnApp();

  const getFcmTokenOnApp = useCallback(() => {
    if (fcmToken) {
      putMembersFcmToken(fcmToken);
    }
  }, [fcmToken]);
  getFcmTokenOnApp();

  useEffect(() => {
    const getCodePushDataAndHideSplash = async () => {
      await CodePush.sync({
        installMode: CodePush.InstallMode.IMMEDIATE,
      });

      let hideSplash = setTimeout(() => {
        SplashScreen.hide();
      }, 500);
      return () => clearTimeout(hideSplash);
    };
    getCodePushDataAndHideSplash();
  }, []);

  if (loading) {
    return null;
  }
  // ?????? ?????? ??????
  if (isLogin) {
    return (
      <NavigationContainer
        ref={RootNavigation.navigationRef}
        onStateChange={(state) => {
          const currentRouteName = RootNavigation.getActiveRouteName(state);
          RootNavigation.routeNameRef.current = currentRouteName;
        }}
      >
        <MainStack />
      </NavigationContainer>
    );
  } else {
    return (
      <NavigationContainer ref={RootNavigation.navigationRef}>
        <MainStackUnlogged />
      </NavigationContainer>
    );
  }
};
// https://velog.io/@minwoo129/React-Native%EC%97%90%EC%84%9C-CodePush-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0
// ??? ?????? ??????
const codePushOptions = {
  // ?????? ??????????????? ??? ?????? ????????? ????????????.
  checkFrequency: CodePush.CheckFrequency.MANUAL,
  // ????????? ??????????????? ????????? ????????? ????????????.
  // installMode: CodePush.InstallMode.ON_NEXT_RESTART,
};

export default CodePush(codePushOptions)(AppWrapper);
