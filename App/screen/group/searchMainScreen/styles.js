import { StyleSheet } from 'react-native';
import { colors, toSize } from '../../../config/globalStyle';

export const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    // marginTop: toSize(8),
    alignItems: 'center',
    // marginHorizontal: toSize(18),
    marginRight: toSize(18),
    marginVertical: toSize(8),
    // borderWidth: 1,
    // borderColor: 'red',
  },
  backBtn: {
    width: toSize(44),
    height: toSize(44),
    marginHorizontal: toSize(6),
    // borderWidth: 1,
    // borderColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    height: toSize(43),
    borderRadius: 999,
    backgroundColor: colors.ColorF4F4F4,
    alignItems: 'center',
    paddingLeft: toSize(14),
  },
  menuContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  menu: {
    height: toSize(60),
    borderBottomWidth: 1,
    borderColor: colors.ColorF4F4F4,
  },
  recommandContainer: {
    paddingTop: toSize(8),
    paddingLeft: toSize(15),
  },
  popularContainer: {
    paddingTop: toSize(24),
    paddingHorizontal: toSize(15),
  },
});
