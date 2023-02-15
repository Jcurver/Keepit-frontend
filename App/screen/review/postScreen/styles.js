import { WINDOW_WIDTH } from '@gorhom/bottom-sheet';
import { StyleSheet } from 'react-native';
import { colors, toSize } from 'config/globalStyle';

export const styles = StyleSheet.create({
  headerRightButton: {
    backgroundColor: 'white',
    paddingHorizontal: toSize(12),
    paddingVertical: toSize(2),
    marginRight: toSize(-8),
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.ColorCBD2E0,
  },
  headerStyle: {
    fontWeight: 'bold',
  },
  groupTitleText: {
    marginTop: toSize(30),
    marginHorizontal: toSize(16),
    fontSize: toSize(20),
    marginBottom: toSize(12),

    color: colors.Color191919,
  },
  grayline: {
    borderColor: colors.ColorF4F4F4,
    borderWidth: toSize(0.5),
  },
  searchPlaceView: {
    marginTop: toSize(18),
    height: toSize(48),
    backgroundColor: colors.ColorEEEEEE,
    borderRadius: toSize(14),
    marginHorizontal: toSize(16),
    paddingHorizontal: toSize(22),
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: toSize(16),
  },
  pleaseSetPlaceText: {
    marginLeft: toSize(12),
  },
  explainContainer: {
    marginHorizontal: toSize(18),
    marginTop: toSize(8),
    marginBottom: toSize(20),
    flexWrap: 'wrap',
    minHeight: toSize(333),
  },
  submitButton: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: toSize(18),
    backgroundColor: colors.primary,
    height: toSize(48),
    marginHorizontal: toSize(16),
    width: WINDOW_WIDTH - toSize(32),
    borderRadius: toSize(6),
  },
  keyboardFeature: {
    height: toSize(34),
    borderTopWidth: toSize(1),
    borderTopColor: colors.ColorF4F4F4,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: toSize(12),
  },
});
