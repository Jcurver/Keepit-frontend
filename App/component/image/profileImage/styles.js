import { StyleSheet } from 'react-native';
import { colors, toSize } from '../../../config/globalStyle';

export const styles = StyleSheet.create({
  emptyProfile: {
    width: toSize(96),
    height: toSize(96),
    backgroundColor: colors.ColorF0FFF9,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    // marginVertical: toSize(24),
  },
  userImage: {
    width: toSize(40),
    height: toSize(40),
    borderRadius: 22,
    borderWidth: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    position: 'absolute',
    right: 0,
    bottom: 4,
    borderRadius: 16,
  },
  image: {
    width: toSize(96),
    height: toSize(96),
    borderRadius: 55,
    borderWidth: 0.5,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
