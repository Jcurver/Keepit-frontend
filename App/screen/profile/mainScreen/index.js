import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Svg from '../../../asset/svg';
import AppHeader from '../../../component/common/appHeader';
import AppText from '../../../component/common/appText';
import AppTouchable from '../../../component/common/appTouchable';
import { colors, images, toSize } from '../../../config/globalStyle';
import MyIcon from '../../../config/icon-font';
import RootNavigation from '../../../RootNavigation';
import Screen from '../../Screen';
import { callApi } from '../../../function/auth';
import { styles } from './styles';
import Config from 'react-native-config';
import { getMypageHome } from '../../../api/myPage';
import { image_small } from '../../../constants/imageSize';
import AppImage from '../../../component/common/appImage';
import CryptoJS from 'react-native-crypto-js';

const ProfileMainScreen = () => {
  const authInfo = useSelector((state) => state.user.authInfo);
  const [toastText, setToastText] = useState();
  const [data, setData] = useState();
  const [phone, setPhone] = useState();

  useFocusEffect(
    useCallback(() => {
      callApi(getMypageHome, null, handleData);
    }, []),
  );

  const handleData = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      setData(res.data.data);
      var rawData = CryptoJS.enc.Base64.parse(res.data.data.memberInfo.phone);
      var key = CryptoJS.enc.Latin1.parse(Config.AES_KEY);
      var iv = CryptoJS.enc.Latin1.parse(Config.AES_IV);
      var plaintextData = CryptoJS.AES.decrypt({ ciphertext: rawData }, key, {
        iv: iv,
      });
      setPhone(plaintextData.toString(CryptoJS.enc.Latin1));
      console.log(res.data.data.memberInfo);
    }
  };

  return (
    <Screen
      bgColor={colors.ColorF5F5F5}
      topSafeAreaColor={'white'}
      toastText={toastText}
    >
      <AppHeader
        style={{ backgroundColor: 'white' }}
        rightIcon={Svg('settings')}
        rightIconPress={() =>
          RootNavigation.navigate('ProfileSettingScreen', { phone })
        }
      />
      <AppTouchable
        style={styles.container}
        onPress={() =>
          RootNavigation.navigate('ProfileScreen', {
            fromProfile: true,
            profileUrl: data.memberInfo.profileUrl,
            name: data.memberInfo.name,
          })
        }
      >
        <View style={styles.profileContainer}>
          {data?.memberInfo.profileUrl ? (
            <AppImage
              source={{
                uri: `${Config.IMAGE_SERVER_URI}/${data.memberInfo.profileUrl}${image_small}`,
              }}
              style={styles.emptyProfile}
              icon={'profile_empty'}
              size={toSize(33)}
              color={colors.ColorAEE9D2}
            />
          ) : (
            <View style={styles.emptyProfile}>
              <MyIcon
                name={'profile_empty'}
                size={toSize(33)}
                color={colors.ColorAEE9D2}
              />
            </View>
          )}
          <AppText
            size={16}
            weight={'bold'}
            style={styles.name}
            numberOfLines={2}
          >
            {data?.memberInfo.name}
          </AppText>
        </View>
        {Svg('ic_next', { marginHorizontal: toSize(6) })}
      </AppTouchable>
      <View style={styles.infoContainer}>
        <AppTouchable
          style={styles.infoBox}
          onPress={() => RootNavigation.navigate('ProfileWrittenScreen')}
        >
          <AppText
            style={{ lineHeight: toSize(18) }}
            size={12}
            color={colors.Color6B6A6A}
          >
            작성글
          </AppText>
          <AppText
            style={{ lineHeight: toSize(24) }}
            size={16}
            color={colors.primary}
            weight={'bold'}
          >
            {data?.writingCount}
          </AppText>
        </AppTouchable>
        <AppTouchable
          style={styles.infoBox}
          onPress={() => RootNavigation.navigate('ProfileKeepScreen')}
        >
          <AppText
            style={{ lineHeight: toSize(18) }}
            size={12}
            color={colors.Color6B6A6A}
          >
            킵목록
          </AppText>
          <AppText
            style={{ lineHeight: toSize(24) }}
            size={16}
            color={colors.primary}
            weight={'bold'}
          >
            {data?.keepCount}
          </AppText>
        </AppTouchable>
        <AppTouchable
          style={styles.infoBox}
          onPress={() => RootNavigation.navigate('ProfileFollowScreen')}
        >
          <AppText
            style={{ lineHeight: toSize(18) }}
            size={12}
            color={colors.Color6B6A6A}
          >
            팔로잉
          </AppText>
          <AppText
            style={{ lineHeight: toSize(24) }}
            size={16}
            color={colors.primary}
            weight={'bold'}
          >
            {data?.followCount}
          </AppText>
        </AppTouchable>
      </View>

      <AppTouchable
        style={styles.menuContainer}
        onPress={() => RootNavigation.navigate('ProfileGroupScreen')}
      >
        <AppText size={16}>그룹관리</AppText>
        {Svg('ic_next', { marginRight: toSize(6) })}
      </AppTouchable>

      <AppTouchable
        style={styles.menuContainer}
        onPress={() => RootNavigation.navigate('ProfileServiceScreen')}
      >
        <AppText size={16}>고객센터</AppText>
        {Svg('ic_next', { marginRight: toSize(6) })}
      </AppTouchable>

      <AppTouchable
        style={styles.menuContainer}
        onPress={() => RootNavigation.navigate('ProfileNoticeScreen')}
      >
        <AppText size={16}>공지사항</AppText>
        {Svg('ic_next', { marginRight: toSize(6) })}
      </AppTouchable>

      <AppTouchable
        style={styles.menuContainer}
        onPress={() =>
          RootNavigation.navigate('ProfileSettingScreen', { phone })
        }
      >
        <AppText size={16}>설정</AppText>
        {Svg('ic_next', { marginRight: toSize(6) })}
      </AppTouchable>
    </Screen>
  );
};

export default ProfileMainScreen;
