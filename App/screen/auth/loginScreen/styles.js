import { StyleSheet } from 'react-native';
import { colors, toSize } from '../../../config/globalStyle';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: toSize(17),
    marginBottom: toSize(18),
  },
  back: {
    marginLeft: toSize(4),
    width: toSize(44),
    height: toSize(44),
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth: 1,
    // borderColor: 'red',
  },
  confirm: {
    marginTop: toSize(16),
  },
  login: {
    textDecorationLine: 'underline',
  },
  messageButton: {
    marginTop: toSize(16),
    marginBottom: toSize(16),
    backgroundColor: colors.ColorC4C4C4,
  },
  guide: {
    marginVertical: toSize(13),
  },
  kakaoButton: {
    height: toSize(40),
    backgroundColor: colors.ColorFEE500,
  },
  googleButton: {
    marginTop: toSize(12),
    height: toSize(40),
    backgroundColor: colors.ColorEEEEEE,
  },
  bottomSheetBackground: {
    backgroundColor: colors.black60,
  },
});
