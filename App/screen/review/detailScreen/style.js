import { WINDOW_HEIGHT, WINDOW_WIDTH } from '@gorhom/bottom-sheet';
import { StyleSheet } from 'react-native';
import { toSize } from 'config/globalStyle';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const styles = StyleSheet.create({
  headerStyle: {
    fontWeight: 'bold',
  },
  deleteContainer: {
    width: WINDOW_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    marginTop: toSize(20),
  },
  emptyComponentView: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: toSize(90),
  },
  commentFooterView: {
    width: WINDOW_WIDTH,
    height: toSize(84),
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentFooterButton: {
    width: toSize(122),
    height: toSize(47),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0FFF9',
    borderRadius: 9999,
  },
});
