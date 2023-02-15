import { StyleSheet } from 'react-native';
import { colors, toSize } from '../../../config/globalStyle';

export const styles = StyleSheet.create({
  close: {
    width: toSize(24),
    height: toSize(24),
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  container: {
    flex: 1,
    marginTop: toSize(0),
    marginHorizontal: toSize(16),
  },
  title: {
    marginTop: toSize(8),
    marginBottom: toSize(28),
  },
  seperator: {
    borderWidth: 0.5,
    borderColor: colors.ColorE5E5E5,
    marginVertical: toSize(12),
  },
  confirmButton: {
    marginTop: toSize(50),
    backgroundColor: colors.ColorC4C4C4,
  },
});
