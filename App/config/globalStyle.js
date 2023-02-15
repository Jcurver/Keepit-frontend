import { Dimensions, StatusBar, StyleSheet } from 'react-native';
import { hasNotch } from 'react-native-device-info';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { SafeArea } from '../function/SafeArea';

export const colors = {
  ColorC4C4C4: '#C4C4C4',
  ColorC1C1C1: '#C1C1C1',
  Color6B6A6A: '#6B6A6A',
  ColorAFB1B6: '#AFB1B6',
  ColorFEE500: '#FEE500',
  Color675C5C: '#675C5C',
  ColorEEEEEE: '#EEEEEE',
  ColorEC0000: '#EC0000',
  ColorE5E5E5: '#E5E5E5',
  Color007AFF: '#007AFF',
  ColorFF3b30: '#FF3B30',
  Color27508D: '#27508D',
  ColorD9D9D9: '#D9D9D9',
  ColorF0102B: '#F0102B',
  Color818181: '#818181',
  ColorFFBEBE: '#FFBEBE',
  Color61646B: '#61646B',
  Color04BF7B: '#04BF7B',
  ColorCBD2E0: '#CBD2E0',
  ColorDADCDF: '#DADCDF',
  ColorC9CBCE: '#C9CBCE',
  ColorA5A1A1: '#A5A1A1',
  ColorFF0000: '#FF0000',
  ColorE8F2FC: '#E8F2FC',
  Color6FB7FF: '#6FB7FF',
  ColorDADEC4: '#DADEC4',
  ColorA7A7A7: '#A7A7A7',
  ColorF4F4F4: '#F4F4F4',
  ColorF5F5F5: '#F5F5F5',
  ColorCEFCFF: '#CEFCFF',
  ColorDBDBDB: '#DBDBDB',
  Color191919: '#191919',
  Color49445C: '#49445C',
  Color00F619: '#00F619',
  Color3FDB08: '#3FDB08',
  Color2FEA9B: '#2FEA9B',
  primary: '#00D282',
  Color2D2F30: '#2D2F30',
  ColorF0FFF9: '#F0FFF9',
  ColorAEE9D2: '#AEE9D2',
  ColorFFE9E9: '#FFE9E9',

  transparent: '#00000000',
  black: '#2D2F30',
  black60: '#00000099',
  black34: '#00000057',
  white85: '#FFFFFFD9',
  ColorEBEBEB75: '#EBEBEB75',
  ColorD2D2D26E: '#D2D2D26E',
  white: '#FFFFFF',
  red: '#FF0000',
};
export const toSize = (input) => {
  const scaleVertical = screenHeight / 667;
  const scaleHorizontal = screenWidth / 375;
  const scale = Math.min(scaleHorizontal, scaleVertical);
  return scale * input;
};

export const fonts = {
  SpoqaHanSansNeo_Bold: 'SpoqaHanSansNeo-Bold',
  SpoqaHanSansNeo_Medium: 'SpoqaHanSansNeo-Medium',
  SpoqaHanSansNeo_Regular: 'SpoqaHanSansNeo-Regular',
};

export const notchHeight = toSize(12);
export const notchBarHeight = toSize(31);

export const bottomTabItemHeight = toSize(48);
export const bottomTabPaddingBottom = hasNotch() ? toSize(22) : toSize(16);
export const bottomTabHeight = hasNotch()
  ? bottomTabItemHeight + bottomTabPaddingBottom + notchHeight
  : bottomTabItemHeight + bottomTabPaddingBottom;

// export const screenHeight = Dimensions.get('window').height;
// export const screenWidth = Dimensions.get('window').width;
export const screenHeight = Dimensions.get('window').height;
export const screenWidth = Dimensions.get('window').width;

// export const statusBarHeight = hasNotch() ? toSize(46) : toSize(25);

export const images = {
  kakaoLogo: require('../asset/kakao_logo.png'),
  googleLogo: require('../asset/google_logo.png'),
  ic_check: require('../asset/ic_check.png'),
  ic_plus: require('../asset/ic_plus.png'),
  ic_person_join: require('../asset/ic_person_join.png'),
  ic_addProfile: require('../asset/profile/ic_addProfile.png'),
  emptyProfile: require('../asset/profile/emptyProfile.png'),
  groupImage: require('../asset/image_dasd1.png'),
  ic_circle: require('../asset/ic_circle.png'),
  ic_lock_color: require('../asset/ic_lock_color.png'),
  signup_complete: require('../asset/signup_complete.png'),
  welcomePic: require('../asset/welcome_pic.png'),

  // group
  ic_myGroup: require('../asset/group/ic_myGroup.png'),
};

export const globalStyle = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
  },
  flexRowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInputContainer: {
    backgroundColor: colors.white,
    height: toSize(48),
    borderColor: colors.ColorE5E5E5,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: toSize(16),
    justifyContent: 'center',
  },
  seperater: {
    borderWidth: 0.5,
    borderColor: colors.ColorE5E5E5,
  },
  empty: {
    backgroundColor: colors.ColorC4C4C4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
