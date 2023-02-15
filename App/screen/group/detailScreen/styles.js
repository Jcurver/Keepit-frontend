import { StyleSheet } from 'react-native';
import { toSize } from '../../../config/globalStyle';

export const styles = StyleSheet.create({
  groupProfile: {
    alignSelf: 'center',
    marginTop: toSize(16),
    marginBottom: toSize(12),
    width: toSize(96),
    height: toSize(96),
    borderRadius: 999,
  },
  infoContainer: {
    marginHorizontal: toSize(16),
    marginTop: toSize(32),
  },
  info: {
    flexDirection: 'row',
    marginBottom: toSize(16),
  },
});
