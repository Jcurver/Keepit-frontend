import { WINDOW_WIDTH } from '@gorhom/bottom-sheet';
import { StyleSheet } from 'react-native';
import { colors, toSize } from '../../../config/globalStyle';

export const styles = StyleSheet.create({
  headerStyle: {
    fontWeight: 'bold',
  },

  grayline: {
    borderColor: colors.ColorF4F4F4,
    borderWidth: toSize(0.5),
  },
  marginHorizontal16: {
    marginHorizontal: toSize(16),
  },
  inputView: {
    marginHorizontal: toSize(16),
    marginBottom: toSize(12),
    justifyContent: 'center',
    marginTop: toSize(16),
  },
  inputTitleView: {
    marginTop: toSize(18),
    fontWeight: 900,
  },
  keyboardFeature: {
    height: toSize(34),
    borderTopWidth: toSize(1),
    borderTopColor: colors.ColorF4F4F4,
    // marginBottom: toSize(-74),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: toSize(12),
  },
  modalButton: {
    backgroundColor: colors.primary,
    marginHorizontal: toSize(34),
  },
  modalCancelButton: {
    color: colors.primary,
    marginHorizontal: toSize(34),
  },
  image: {
    width: WINDOW_WIDTH - toSize(32),
    height: WINDOW_WIDTH - toSize(32),
    marginTop: toSize(12),
  },
  imageView: {
    position: 'relative',
  },
  imageCloseButton: {
    position: 'absolute',
    width: toSize(24),
    height: toSize(24),
    borderRadius: 999,
    backgroundColor: colors.Color2D2F30,
    right: toSize(10),
    top: toSize(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
