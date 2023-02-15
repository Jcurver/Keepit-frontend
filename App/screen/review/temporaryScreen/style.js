import { WINDOW_WIDTH } from '@gorhom/bottom-sheet';
import { StyleSheet } from 'react-native';
import { colors, toSize } from '../../../config/globalStyle';

export const styles = StyleSheet.create({
  reviewBox: {
    paddingHorizontal: toSize(16),
    height: toSize(66),
    justifyContent: 'center',
  },
  reviewPlace: {
    marginBottom: toSize(4),
  },
  scrollView: {
    height: '100%',
  },
  header: {
    fontWeight: 'bold',
  },
  grayline: {
    width: WINDOW_WIDTH - toSize(32),
    height: toSize(1),
    marginLeft: toSize(16),
    backgroundColor: colors.ColorF4F4F4,
  },
});
