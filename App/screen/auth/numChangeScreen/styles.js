import { StyleSheet } from 'react-native';
import { colors, toSize } from '../../../config/globalStyle';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: toSize(16),
    marginBottom: toSize(18),
  },
  common1: {
    marginTop: toSize(4),
  },
  common2: {
    marginTop: toSize(24),
  },
  placeSize: {
    height: toSize(79),
    marginTop: toSize(8),
  },
  ectSize: {
    marginTop: toSize(8),
  },
  error: {
    paddingTop: toSize(4),
    height: toSize(26),
  },
  // ectSize: {
  //   height: toSize(112),
  //   marginTop: toSize(8),
  //   justifyContent: 'flex-start',
  //   paddingTop: toSize(10),
  // },
  queryButton: {
    marginTop: toSize(35),
    marginBottom: toSize(24),
    backgroundColor: colors.primary,
  },
});
