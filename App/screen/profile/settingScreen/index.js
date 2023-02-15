import React, { useState } from 'react';
import { Linking } from 'react-native';
import { useDispatch } from 'react-redux';
import { postMembersLogout } from '../../../api/user';
import Svg from '../../../asset/svg';
import AppHeader from '../../../component/common/appHeader';
import AppModal from '../../../component/common/appModal';
import AppText from '../../../component/common/appText';
import MypageSettingTab from '../../../component/mypage/settingTab';
import { colors, toSize } from '../../../config/globalStyle';
import MyIcon from '../../../config/icon-font';
import { callApi } from '../../../function/auth';
import { logout } from '../../../function/logout';
import RootNavigation from '../../../RootNavigation';
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
import { styles } from './styles';

const ProfileSettingScreen = ({ route: { params } }) => {
  const [logoutVisible, setLogoutVisible] = useState(false);
  const dispatch = useDispatch();

  const handleLogout = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      dispatch(setAuthInfo(null));
      dispatch(setGroupSliceInit());
      dispatch(setReviewSliceInit());
      dispatch(setUserSliceInit());
      dispatch(setMapGroup());
      RootNavigation.reset([{ name: 'IntroScreen' }]);
    }
  };
  return (
    <Screen
      bottomSafeAreaColor={colors.ColorF5F5F5}
      bgColor={colors.ColorF5F5F5}
      topSafeAreaColor={'white'}
    >
      <AppHeader
        title={'설정'}
        style={{ backgroundColor: 'white' }}
        leftIcon={Svg('ic_backBtn')}
        leftIconPress={() => RootNavigation.goBack()}
      />

      <AppText style={styles.menu} weight={'medium'} color={colors.Color2D2F30}>
        사용자 설정
      </AppText>

      <MypageSettingTab
        title={'계정 설정'}
        onPress={() =>
          RootNavigation.navigate('ProfileAccountScreen', {
            phone: params.phone,
          })
        }
      />
      <MypageSettingTab
        title={'알림 설정'}
        onPress={() => RootNavigation.navigate('AlarmSettingScreen')}
      />
      <MypageSettingTab
        title={'차단 멤버 관리'}
        onPress={() => RootNavigation.navigate('ProfileBlockScreen')}
      />

      <AppText style={styles.menu} weight={'medium'} color={colors.Color2D2F30}>
        서비스 정보
      </AppText>

      <MypageSettingTab
        title={'이용 약관'}
        onPress={() => {
          Linking.openURL(
            'https://geode-grapple-e1f.notion.site/Keep-it-f6b10aa0850346b1a5f0ddeaf7ebcb0a',
          );
        }}
      />
      <MypageSettingTab
        title={'개인 정보 처리 방침'}
        onPress={() => {
          Linking.openURL(
            'https://geode-grapple-e1f.notion.site/Keep-it-4251210c2d9f49e890b10a651e85fedd',
          );
        }}
      />
      <MypageSettingTab
        title={'위치기반 서비스 이용약관'}
        onPress={() => {
          Linking.openURL(
            'https://geode-grapple-e1f.notion.site/Keep-it-4ff1c31306a941dab1d0e0f117bca26b',
          );
        }}
      />

      <MypageSettingTab
        style={{ marginTop: toSize(24) }}
        title={'로그아웃'}
        onPress={() => setLogoutVisible(true)}
      />

      <AppModal
        visible={logoutVisible}
        title={'로그아웃 하시겠어요?'}
        leftButtonText={'취소'}
        onPressLeft={() => setLogoutVisible(false)}
        rightButtonText={'로그아웃'}
        onPressRight={() => {
          logout(true);
          setLogoutVisible(false);
          // callApi(postMembersLogout, null, handleLogout);
        }}
      />
    </Screen>
  );
};

export default ProfileSettingScreen;
