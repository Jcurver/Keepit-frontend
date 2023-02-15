import { StyleSheet } from 'react-native';
import { colors, toSize } from 'config/globalStyle';

export const styles = StyleSheet.create({
  grayline: {
    borderColor: colors.ColorCBD2E0,
    borderWidth: toSize(0.5),
    marginHorizontal: toSize(18),
  },
  searchPlaceView: {
    marginTop: toSize(18),
    height: toSize(48),
    backgroundColor: colors.ColorF4F4F4,
    borderRadius: toSize(14),
    marginHorizontal: toSize(16),
    paddingHorizontal: toSize(22),
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: toSize(6),
  },
  pleaseSetPlaceText: {
    marginLeft: toSize(12),
  },
  maringLeft: {
    marginLeft: toSize(8),
  },
  selectedPlaceView: {
    marginHorizontal: toSize(20),
    marginTop: toSize(18),
    marginBottom: toSize(12),
    height: toSize(43),
    justifyContent: 'center',
  },
  selectedPlace: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: toSize(6),
    alignItems: 'center',
  },
  selectedAddress: {
    marginLeft: toSize(-13),
  },
});
