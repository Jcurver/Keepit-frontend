import React, { useRef, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import WebView from 'react-native-webview';
import { useDispatch, useSelector } from 'react-redux';
import { colors, toSize } from '../../../config/globalStyle';
import { getMap } from './mapfile';
import Screen from '../../Screen';
import { PixelRatio } from 'react-native';
import { screenWidth } from '../../../config/globalStyle';
import { WINDOW_WIDTH } from '@gorhom/bottom-sheet';
import Svg from '../../../asset/svg';
import AppTouchable from '../../../component/common/appTouchable';
import RootNavigation from '../../../RootNavigation';
import AppTextInput from '../../../component/common/appTextInput';
import MyIcon from '../../../config/icon-font';
import { setMapRefresh } from '../../../store/feature/groupSlice';

const MapWebScreen = ({ route: { params } }) => {
  const inputRef = useRef();
  const dispatch = useDispatch();
  return (
    <Screen type="view">
      <View style={styles.view}>
        <WebView
          automaticallyAdjustContentInsets={false}
          originWhitelist={['http://', 'https://']}
          source={{ uri: `https://map.kakao.com/link/to/${params?.placeId}` }}
          style={styles.container}
        />
        <View style={styles.flexRow}>
          <AppTouchable
            style={[styles.goback, styles.shadow]}
            onPress={() => {
              dispatch(setMapRefresh(false));
              RootNavigation.goBack();
            }}
          >
            {Svg('back_thin')}
          </AppTouchable>
          {/* <AppTouchable
            style={[styles.searchView, styles.shadow]}
            onPress={() => {
              inputRef.current.focus();
            }}
          >
            {Svg('search_thin')}
            <AppTextInput
              inputRef={inputRef}
              style={styles.input}
              placeholder={'장소를 검색해주세요'}
            />
          </AppTouchable> */}
        </View>
      </View>
    </Screen>
  );
};

export default MapWebScreen;

const styles = StyleSheet.create({
  container: {
    width: screenWidth + 1,
    // borderWidth: 5,
    // borderColor: colors.black,
  },
  start: {
    backgroundColor: colors.primary,
    marginHorizontal: toSize(34),
    marginBottom: toSize(10),
  },
  view: {
    position: 'relative',
    width: screenWidth,
    height: '100%',
    backgroundColor: 'yellow',
    marginTop: -3,
  },
  start2: {
    backgroundColor: colors.primary,
    marginHorizontal: toSize(34),
    marginBottom: toSize(40),
  },
  flexRow: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: WINDOW_WIDTH,
    paddingHorizontal: toSize(16),
    height: toSize(48),
    // top: 50,
  },
  goback: {
    width: toSize(48),
    height: toSize(48),
    borderRadius: 999,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchView: {
    width: WINDOW_WIDTH - toSize(95),
    height: toSize(48),
    borderRadius: 999,
    alignItems: 'center',
    paddingHorizontal: toSize(17.33),
    flexDirection: 'row',

    backgroundColor: 'white',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
  },
  input: {
    width: WINDOW_WIDTH - toSize(175),
    marginLeft: toSize(15),
    marginTop: toSize(1.1),
  },
  option: {
    position: 'absolute',
    right: toSize(16),

    width: toSize(42),
    height: toSize(42),
    borderRadius: 999,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  greenbutton: {
    backgroundColor: colors.primary,
    width: toSize(56),
    height: toSize(56),
    position: 'absolute',
    right: toSize(17),
    bottom: toSize(76),
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    elevation: 5,
  },
});
