import { StyleSheet } from 'react-native';
import { colors, toSize } from '../../../config/globalStyle';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    // height: toSize(24),
    // marginVertical: toSize(3.5),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalBox: {
    width: toSize(22),
    height: toSize(22),
    marginRight: toSize(16),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 999,
    borderColor: colors.ColorE5E5E5,
  },
  box: {
    width: toSize(22),
    height: toSize(22),
    marginRight: toSize(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    // borderWidth: 1,
    // borderColor: 'red',
  },
});
