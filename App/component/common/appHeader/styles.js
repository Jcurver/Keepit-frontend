import { StyleSheet } from 'react-native';
import { colors, toSize } from '../../../config/globalStyle';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: toSize(42),
    margin: 0,
    alignItems: 'center',
    zIndex: 50,
  },
  icon: {
    // minWidth: toSize(20),
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 1,
  },
  leftIcon: {
    left: toSize(6),
    width: toSize(44),
    height: toSize(44),
    alignItems: 'center',
    justifyContent: 'center',
    // paddingVertical: toSize(12),
    // paddingRight: toSize(20),
  },
  rightIcon: {
    right: toSize(16),
    paddingVertical: toSize(2),
    paddingHorizontal: toSize(7),
  },
  rightSecondIcon: {
    right: toSize(60),
    paddingVertical: toSize(2),
    paddingHorizontal: toSize(7),
  },
  title: {
    flex: 1,
    marginHorizontal: toSize(60),
  },
  titleLeft: {
    paddingLeft: toSize(44),
    textAlign: 'left',
  },
  titleCenter: {
    textAlign: 'center',
  },
});
