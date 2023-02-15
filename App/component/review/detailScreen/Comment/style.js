import { WINDOW_HEIGHT, WINDOW_WIDTH } from '@gorhom/bottom-sheet';
import { reduce } from 'lodash';
import { StyleSheet } from 'react-native';
import { colors, toSize } from '../../../../config/globalStyle';

export const styles = StyleSheet.create({
  container: {
    paddingVertical: toSize(8),
    // paddingLeft: toSize(6),
  },
  paddingContent: {
    paddingHorizontal: toSize(16),
  },
  grayLine: {
    borderTopWidth: toSize(1),
    borderTopColor: colors.ColorF4F4F4,
  },
  avatar: {
    width: toSize(24),
    height: toSize(24),
    marginRight: toSize(5),
    position: 'relative',
    borderRadius: 999,
  },
  profileView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: toSize(10),
    justifyContent: 'space-between',
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  etc_large_virtical: {
    position: 'absolute',
    right: toSize(6),
    color: colors.Color6B6A6A,
  },
  nested_etc_large_virtical: {
    right: toSize(0),
    color: colors.Color6B6A6A,
    paddingHorizontal: toSize(12),
    paddingVertical: toSize(4),
  },
  commentImage: {
    width: toSize(74),
    height: toSize(74),
    marginBottom: toSize(10),
  },
  commentText: {
    width: toSize(306),
    marginBottom: toSize(10),
  },
  targetName: {
    marginRight: toSize(5),
  },

  nestedContainer: {
    paddingRight: toSize(29),
    marginLeft: toSize(6),
  },
  flexRow: {
    flexDirection: 'row',
  },
  width100: {
    width: '100%',
  },
  modalRelative: {
    position: 'relative',
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    zIndex: 938,
  },
  modalClose: {
    position: 'absolute',
    top: toSize(50),
    left: toSize(13),
    zIndex: 1000,
    padding: toSize(8),
  },
  bottomIndicator: {
    position: 'absolute',
    bottom: toSize(56),
    left: (WINDOW_WIDTH - toSize(30)) / 2,
  },
  modalImage: {
    width: '100%',
    height: '74%',
    marginTop: '23%',
  },
  modalContainer: {
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    // position: 'relative',
    backgroundColor: colors.Color2D2F30,
  },
  carousel: {
    backgroundColor: colors.Color2D2F30,
  },
  imageContainer: {
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
