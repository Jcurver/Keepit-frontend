import { StyleSheet } from 'react-native';
import { colors, toSize } from 'config/globalStyle';
import { WINDOW_WIDTH } from '@gorhom/bottom-sheet';

export const styles = StyleSheet.create({
  headerStyle: {
    fontWeight: 'bold',
  },
  searchView: {
    position: 'relative',
    backgroundColor: colors.ColorEEEEEE,
    marginHorizontal: toSize(16),
    marginTop: toSize(18),
    height: toSize(48),
    borderRadius: toSize(14),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: toSize(22),
  },
  searchInput: {
    marginLeft: toSize(12),
    width: '100%',
    color: colors.Color2D2F30,
  },
  ereaseButton: {
    position: 'absolute',
    width: toSize(17),
    height: toSize(17),
    borderRadius: 999,
    backgroundColor: colors.Color6B6A6A,
    right: toSize(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPlaceSearchView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: toSize(158),
  },
  placeSearchView: {
    flex: 1,
    paddingHorizontal: toSize(17),
    height: toSize(77),
    justifyContent: 'center',
  },
  flexRow: {
    flexDirection: 'row',
  },
  grayline: {
    backgroundColor: colors.ColorF4F4F4,
    width: WINDOW_WIDTH - toSize(32),
    height: toSize(1),
    marginHorizontal: toSize(16),
  },
});
