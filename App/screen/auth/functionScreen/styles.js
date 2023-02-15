import { StyleSheet } from 'react-native';
import { colors, toSize } from '../../../config/globalStyle';

export const styles = StyleSheet.create({
  wrapper: {},

  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: colors.ColorEEEEEE,
  },

  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: colors.ColorEEEEEE,
  },

  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: colors.ColorEEEEEE,
  },

  slide4: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: colors.ColorEEEEEE,
  },

  text: {
    color: colors.black,
    fontSize: 25,
    fontWeight: 'bold',
  },

  start: {
    marginBottom: toSize(165),
    // marginTop: toSize(524),
    backgroundColor: colors.primary,
    marginHorizontal: toSize(16),
  },
});
