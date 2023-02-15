import { StyleSheet } from 'react-native';
import { colors, toSize } from '../../../config/globalStyle';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkContainer: {
    width: toSize(66),
    height: toSize(66),
    borderRadius: 999,
    backgroundColor: colors.ColorF0FFF9,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: toSize(36),
  },
  contect: {
    marginTop: toSize(12),
    textAlign: 'center',
  },
  queryButton: {
    height: toSize(48),
    marginHorizontal: toSize(16),
    marginBottom: toSize(12),
    backgroundColor: colors.primary,
  },
});
