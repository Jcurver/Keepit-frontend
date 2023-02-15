import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import AppText from '../../../component/common/appText';
import AppTouchable from '../../../component/common/appTouchable';
import {
  colors,
  globalStyle,
  images,
  screenHeight,
  screenWidth,
  toSize,
} from '../../../config/globalStyle';
import MyIcon from '../../../config/icon-font';
import RootNavigation from '../../../RootNavigation';
import {
  setAuthInfo,
  setUserSliceInit,
} from '../../../store/feature/userSlice';
import Screen from '../../Screen';

const IntroScreen = () => {
  const [size, setSize] = useState();

  const calculateResolution = () => {
    const res = Math.floor((screenHeight / screenWidth) * 100) / 100;
    if (res <= 1.77) {
      return setSize(true);
    } else {
      return setSize(false);
    }
  };
  // useEffect(() => {
  //   setUserSliceInit();
  // }, []);

  useFocusEffect(
    useCallback(() => {
      const res = Math.floor((screenHeight / screenWidth) * 100) / 100;
      if (res <= 1.77) {
        console.log(true);
        return setSize(true);
      } else {
        console.log(false);
        return setSize(false);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );
  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.imgContainer}>
          <View style={{ alignSelf: 'flex-end' }}>
            <MyIcon
              size={toSize(39)}
              name={'keepit_logo'}
              color={colors.primary}
            />
            <AppText size={16} style={styles.guideLogo}>
              우리들만의 장소를 모으다
            </AppText>
          </View>
          <Image
            style={size ? styles.old : styles.new}
            source={images.welcomePic}
          />
        </View>
        <AppTouchable
          button
          style={styles.start}
          onPress={() => {
            RootNavigation.navigate('RegisterScreen');
          }}
        >
          <AppText weight={'bold'} size={18} color={colors.white}>
            시작하기
          </AppText>
        </AppTouchable>
      </View>
      <View style={styles.loginContainer}>
        <AppText color={colors.Color6B6A6A}>이미 가입했어요.</AppText>
        <AppTouchable
          onPress={() => {
            RootNavigation.navigate('LoginScreen');
          }}
        >
          <AppText style={styles.login} color={colors.Color6B6A6A}>
            로그인
          </AppText>
        </AppTouchable>
      </View>
    </Screen>
  );
};

export default IntroScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  imgContainer: {
    flex: 1,
    justifyContent: 'center',
    marginTop: toSize(56),
    paddingLeft: toSize(32),
    marginRight: toSize(25),
    // backgroundColor: 'red',
  },
  loginContainer: {
    flexDirection: 'row',
    marginVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  old: {
    width: toSize(200),
    height: toSize(262),
  },
  new: {
    width: toSize(240),
    height: toSize(314),
  },
  guideLogo: {
    marginTop: 8,
    marginBottom: 42,
  },
  login: {
    textDecorationLine: 'underline',
    marginLeft: toSize(4),
  },
  start: {
    backgroundColor: colors.primary,
    marginHorizontal: toSize(16),
  },
});
