import { StyleSheet } from 'react-native';
import { colors, toSize } from '../../../config/globalStyle';

export const styles = StyleSheet.create({
  container: {
    // height: toSize(500),
    borderWidth: 1,
    borderColor: colors.black,
  },
  iconStyle: {
    left: toSize(16),
    backgroudColor: 'black',
    width: undefined,
    height: undefined,
  },
  start: {
    backgroundColor: colors.primary,
    marginHorizontal: toSize(34),
    marginBottom: toSize(10),
  },
  start2: {
    backgroundColor: colors.primary,
    marginHorizontal: toSize(34),
    marginBottom: toSize(40),
  },
  create: {
    width: toSize(120),
    height: toSize(28),
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.ColorCBD2E0,
  },
  plus: {
    marginLeft: toSize(5),
  },
  createBox: {
    width: toSize(120),
    height: toSize(28),
    borderRadius: 999,
    backgroundColor: colors.ColorF0FFF9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  startContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  search: {
    width: toSize(204),
    height: toSize(56),
    borderRadius: 999,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menu: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: toSize(36),
    marginBottom: toSize(12),
    paddingHorizontal: toSize(16),
  },
  empty: {
    alignSelf: 'center',
    textAlign: 'center',
    lineHeight: toSize(24),
  },
});
