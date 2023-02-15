import { StyleSheet } from 'react-native';
import { colors, toSize } from '../../../config/globalStyle';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: toSize(24),
    marginHorizontal: toSize(16),
  },
  warn: {
    height: toSize(30),
    paddingTop: toSize(4),
  },
  textInput: { fontSize: toSize(16) },
  time: {
    // marginTop: toSize(7),
    alignSelf: 'center',
  },
  confirmButton: {
    marginTop: toSize(12),
    marginBottom: toSize(24),
  },
});
