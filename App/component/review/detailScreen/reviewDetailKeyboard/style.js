import { WINDOW_WIDTH } from '@gorhom/bottom-sheet';
import { StyleSheet } from 'react-native';
import { colors, toSize } from 'config/globalStyle';

export const styles = StyleSheet.create({
  inputTopGrayLine: {
    height: toSize(6),
    borderTopWidth: toSize(1),
    borderTopColor: colors.ColorCBD2E0,
  },
  commentBottomTouchable: {
    paddingVertical: toSize(5),

    width: '100%',
    paddingHorizontal: toSize(10),
    // height: toSize(53),
    // paddingVertical: toSize(30),
    // justifyContent: 'center',
    alignItems: 'center',
    borderTopColor: colors.ColorCBD2E0,
  },
  commentUpContainer: {
    backgroundColor: 'white',
    paddingVertical: toSize(10),
    width: '100%',
    // height: toSize(53),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopColor: colors.ColorCBD2E0,
  },
  commentUpInput: {
    backgroundColor: 'white',
    borderRadius: toSize(8),
    borderWidth: toSize(1),
    borderColor: colors.ColorE5E5E5,
    paddingHorizontal: toSize(16),
    marginRight: toSize(4),
    width: WINDOW_WIDTH - toSize(128),
    lineHeight: toSize(21),
    minHeight: toSize(34),

    paddingBottom: toSize(4),
  },
  commentBottomInput: {
    backgroundColor: 'white',
    width: WINDOW_WIDTH - toSize(32),
    borderRadius: toSize(8),
    borderWidth: toSize(1),
    borderColor: colors.ColorE5E5E5,
    paddingHorizontal: toSize(16),
    lineHeight: toSize(21),
    height: toSize(34),

    paddingBottom: toSize(4),
  },
  cameraIcon: {
    paddingHorizontal: toSize(10),
    paddingVertical: toSize(6),
  },
  formSubmit: {
    width: toSize(50),
    height: toSize(37),
    borderRadius: toSize(6),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: toSize(5),
  },
  imageContainer: {
    width: '100%',
    height: toSize(98),
    // backgroundColor: 'transparent',
    paddingVertical: toSize(12),
    flexDirection: 'row',
    paddingLeft: toSize(14),
    backgroundColor: 'rgba(33, 33, 33, .4)',
  },
  image: {
    width: toSize(74),
    height: toSize(74),
    marginLeft: toSize(8),
  },
  removeImageIcon: {
    padding: toSize(5),
  },
  editCloseView: {
    borderTopWidth: toSize(1),
    borderTopColor: colors.ColorCBD2E0,
  },
  editCloseButton: {
    left: toSize(10),
    padding: toSize(9),
  },
});
