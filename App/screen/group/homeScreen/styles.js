import { StyleSheet } from 'react-native';
import { colors, screenWidth, toSize } from '../../../config/globalStyle';

export const styles = StyleSheet.create({
  headerContainer: {
    // flex: 1,
    flexDirection: 'row',
    borderTopRightRadius: 14,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 14,
    alignSelf: 'center',
    width: screenWidth - toSize(32),
    height: toSize(51),
    alignItems: 'center',
    backgroundColor: colors.ColorF4F4F4,
    marginVertical: toSize(12),
    overflow: 'hidden',
  },
  quit: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'red',
  },
  green: {
    flex: 8,
    height: '100%',
    backgroundColor: colors.primary,
  },
  info: {
    flex: 335,
    flexDirection: 'row',
    justifyContent: 'center',
    // marginRight: toSize(8),
  },
  menu: {
    marginHorizontal: toSize(13),
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: colors.primary,
    width: toSize(64),
    height: toSize(64),
    position: 'absolute',
    right: toSize(17),
    bottom: toSize(26),
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  noShadow: {
    backgroundColor: colors.ColorE5E5E5,
  },
  shadow: {
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    elevation: 5,
  },
});
