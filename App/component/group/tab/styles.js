import { StyleSheet } from 'react-native';
import { colors, toSize } from '../../../config/globalStyle';

export const styles = StyleSheet.create({
  tabContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
    // paddingTop: toSize(6),
  },
  tabButton: {
    flex: 1,
    marginTop: toSize(-2),
    alignItems: 'center',
    // borderWidth: 1,
    // borderColor: 'red',
    justifyContent: 'space-between',
  },
  tabIndicator: {
    width: toSize(170),
    height: toSize(3),
  },
  indicatorColor: {
    backgroundColor: colors.Color191919,
  },
  tabSeparator: {
    position: 'absolute',
    bottom: 0,
    zIndex: -1,
  },
  grayline: {
    position: 'relative',
    width: '100%',
    height: toSize(2),
    borderBottomColor: colors.ColorEEEEEE,
    borderBottomWidth: toSize(1),
    alignItems: 'center',
  },
  blackline: {
    position: 'absolute',
    height: toSize(2),
    width: '80%',
    borderRadius: 999,
    backgroundColor: colors.Color2D2F30,
  },
  left: {
    left: '5%',
  },
  right: {
    right: '5%',
  },
});
