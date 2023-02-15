import Clipboard from '@react-native-clipboard/clipboard';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import Config from 'react-native-config';
import { useDispatch, useSelector } from 'react-redux';
import { baseURL } from '../../../api';
import { postMembersLogout, postMembersWithdrawal } from '../../../api/user';
import AppText from '../../../component/common/appText';
import AppTouchable from '../../../component/common/appTouchable';
import Toast from '../../../component/toast';
import { colors, toSize } from '../../../config/globalStyle';
import { callApi, checkToken } from '../../../function/auth';
import updateSameText from '../../../function/updateSameText';
import RootNavigation from '../../../RootNavigation';
import store from '../../../store';
import {
  setGroupSliceInit,
  setMapGroup,
} from '../../../store/feature/groupSlice';
import { setReviewSliceInit } from '../../../store/feature/reviewSlice';
import {
  setAuthInfo,
  setUserSliceInit,
} from '../../../store/feature/userSlice';
import Screen from '../../Screen';

const ProfileTestScreen = () => {
  const authInfo = useSelector((state) => state.user.authInfo);
  const profile = useSelector((state) => state.user.tempProfileImage);
  const [log, setLog] = useState([]);
  const [text, setText] = useState('');
  const dispatch = useDispatch();
  const FCMTOKEN = useSelector((state) => state.device.fcmToken);
  const [toastText, setToastText] = useState();

  const handleFunction = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      dispatch(setAuthInfo(null));
      dispatch(setGroupSliceInit());
      dispatch(setReviewSliceInit());
      dispatch(setUserSliceInit());
      dispatch(setMapGroup());
      RootNavigation.reset([{ name: 'IntroScreen' }]);
    }
  };

  useEffect(() => {
    console.log(authInfo.accessToken);
    setLog((logs) => [...logs, text]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const handleTestApi = async () => {
    const auth = store.getState().user.authInfo;
    setText(
      baseURL +
        '/ping/with-token Get 요청\n' +
        'ACCESS TOKEN: ' +
        auth.accessToken +
        '\n',
    );
    let request = await fetch(baseURL + '/ping/with-token', {
      method: 'get',
      headers: {
        ACCESS_TOKEN: `Bearer ${auth.accessToken}`,
      },
    });
    let responseJson = await request.json();
    console.log(responseJson);
    if (responseJson.apiStatus.apiCode === 200) {
      setText('PINGPONG API 요청 성공 !\n');
    } else if (responseJson.apiStatus.apiCode === 401) {
      setText('PINGPONG API 401 ERROR\n');
      setText('토큰 갱신 요청중...\n');
      checkToken(auth).then((res) => {
        if (res) {
          setText('토큰 갱신 성공 !\n');
          handleTestApi();
        } else {
          setText('토큰 갱신 실패 !\n');
        }
      });
    }
  };
  const fcmTokenPaste = () => {
    Clipboard.setString(FCMTOKEN);
    setToastText((toast) =>
      updateSameText('FCM 토큰이 클립보드에 복사됐어요.', toast),
    );
  };

  return (
    <Screen toastText={toastText}>
      <ScrollView style={styles.container}>
        {profile && (
          <Image
            source={{
              uri: `${Config.SERVER_URI}/files/profile/small` + profile,
            }}
            style={{ width: toSize(300), height: toSize(200) }}
          />
        )}
        <AppText>{log}</AppText>
      </ScrollView>

      <AppTouchable
        button
        style={styles.start}
        onPress={() => {
          handleTestApi();
        }}
      >
        <AppText size={18} color={colors.white}>
          pingpong API
        </AppText>
      </AppTouchable>

      <AppTouchable
        button
        style={styles.start}
        onPress={() => callApi(postMembersLogout, null, handleFunction)}
      >
        <AppText size={18} color={colors.white}>
          로그아웃 하기
        </AppText>
      </AppTouchable>

      <AppTouchable
        button
        style={styles.start}
        onPress={() => callApi(postMembersWithdrawal, null, handleFunction)}
      >
        <AppText size={18} color={colors.white}>
          회원탈퇴 하기
        </AppText>
      </AppTouchable>
      <AppTouchable
        button
        style={styles.start2}
        onPress={() => fcmTokenPaste()}
      >
        <AppText size={18} color={colors.white}>
          FCM 토큰 복사하기
        </AppText>
      </AppTouchable>
    </Screen>
  );
};

export default ProfileTestScreen;

const styles = StyleSheet.create({
  container: {
    // height: toSize(500),
    borderWidth: 1,
    borderColor: colors.black,
  },
  start: {
    backgroundColor: colors.primary,
    marginHorizontal: toSize(34),
    marginBottom: toSize(10),
  },
  start2: {
    backgroundColor: colors.primary,
    marginHorizontal: toSize(34),
    marginBottom: toSize(40),
  },
});
