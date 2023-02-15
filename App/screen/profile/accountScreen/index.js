import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Svg from '../../../asset/svg';
import AppHeader from '../../../component/common/appHeader';
import AppText from '../../../component/common/appText';
import AppTouchable from '../../../component/common/appTouchable';
import MypageSettingTab from '../../../component/mypage/settingTab';
import { colors, images, toSize } from '../../../config/globalStyle';
import MyIcon from '../../../config/icon-font';
import RootNavigation from '../../../RootNavigation';
import Screen from '../../Screen';

const ProfileAccountScreen = ({ route: { params } }) => {
  return (
    <Screen
      bottomSafeAreaColor={colors.ColorF5F5F5}
      bgColor={colors.ColorF5F5F5}
      topSafeAreaColor={'white'}
    >
      <AppHeader
        title={'계정 설정'}
        style={{ backgroundColor: 'white' }}
        leftIcon={Svg('ic_backBtn')}
        leftIconPress={() =>
          RootNavigation.navigate('ProfileSettingScreen', {
            phone: params.phone,
          })
        }
      />

      <AppText style={styles.menu} weight={'medium'} color={colors.Color2D2F30}>
        연결된 계정
      </AppText>

      <View style={styles.container} onPress>
        <AppText style={styles.title} size={16}>
          {params.phone.substring(0, 3) +
            ' ' +
            params.phone.substring(3, params.phone.length === 10 ? 6 : 7) +
            ' ' +
            params.phone.substring(
              params.phone.length === 10 ? 6 : 7,
              params.phone.length,
            )}
        </AppText>
        <AppTouchable
          style={styles.changeContainer}
          onPress={() => RootNavigation.navigate('ProfileChangeScreen')}
        >
          <AppText
            style={styles.changeBtn}
            weight={'medium'}
            color={colors.primary}
          >
            변경
          </AppText>
        </AppTouchable>
      </View>

      <MypageSettingTab
        title={'탈퇴하기'}
        noIcon
        style={{ marginTop: toSize(32) }}
        onPress={() => RootNavigation.navigate('ProfileQuitScreen')}
      />
    </Screen>
  );
};

export default ProfileAccountScreen;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: toSize(16),
    marginBottom: toSize(1),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    marginVertical: toSize(12),
  },
  menu: {
    marginTop: toSize(24),
    marginLeft: toSize(16),
    marginBottom: toSize(4),
  },
  changeContainer: {
    backgroundColor: colors.ColorF0FFF9,
    borderRadius: 6,
  },
  changeBtn: {
    marginHorizontal: toSize(12),
    marginVertical: toSize(8),
  },
});
