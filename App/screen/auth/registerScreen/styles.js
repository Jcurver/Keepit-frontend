import { StyleSheet } from 'react-native';
import { colors, toSize } from '../../../config/globalStyle';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: toSize(100),
    marginHorizontal: toSize(16),
    marginBottom: toSize(18),
  },
  confirm: {
    marginTop: toSize(16),
  },
  login: {
    marginTop: toSize(16),
    textDecorationLine: 'underline',
  },
  messageButton: {
    marginTop: toSize(16),
    marginBottom: toSize(16),
    backgroundColor: colors.ColorC4C4C4,
  },
  guide: {
    marginTop: toSize(16),
    marginBottom: toSize(12),
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
  toast: {
    height: toSize(36),
    backgroundColor: colors.black,
  },
});
