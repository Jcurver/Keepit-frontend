import { StyleSheet } from 'react-native';
import { colors, toSize } from '../../../config/globalStyle';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: toSize(5),
    marginHorizontal: toSize(24),
  },
  tabSection: {
    marginTop: toSize(20),
    backgroundColor: colors.white,
    flex: 1,
    flexDirection: 'row',
  },
  tabButton: {
    height: toSize(24),
    // borderWidth: 1,
    // borderColor: colors.Color2D2F30,
    // alignItems: 'center',
    marginRight: toSize(20),
    marginTop: toSize(12),
  },
  tabIndicator: {
    width: toSize(93),
    height: toSize(3),
  },
  indicatorColor: {
    backgroundColor: colors.Color6B6A6A,
  },
  textInput: { fontSize: toSize(16) },
  time: {
    marginTop: toSize(7),
    alignSelf: 'center',
  },
  confirmButton: {
    marginTop: toSize(14),
    marginBottom: toSize(24),
  },
});
