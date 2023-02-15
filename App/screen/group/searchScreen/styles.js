import { StyleSheet } from 'react-native';
import { colors, toSize } from '../../../config/globalStyle';

export const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    marginLeft: toSize(12),
    marginRight: toSize(19),
    paddingVertical: toSize(8),
    alignItems: 'center',
  },
  back: {
    width: toSize(44),
    height: toSize(44),
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: toSize(10),
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    height: toSize(42),
    borderRadius: 29,
    borderWidth: 1,
    borderColor: colors.ColorE5E5E5,
    alignItems: 'center',
    // marginLeft: toSize(8),
    paddingHorizontal: toSize(14),
  },
  menu: {
    flexDirection: 'row',
    paddingHorizontal: toSize(16),
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: toSize(8),
  },
  container: {
    flex: 1,
    paddingTop: toSize(8),
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptySearch: {
    marginHorizontal: toSize(40),
    textAlign: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  resultContainer: {
    flex: 1,
    paddingTop: toSize(8),
    marginHorizontal: toSize(16),
  },
});
