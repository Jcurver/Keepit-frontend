import { WINDOW_WIDTH } from '@gorhom/bottom-sheet';
import { StyleSheet } from 'react-native';
import { colors, toSize } from '../../../config/globalStyle';

export const styles = StyleSheet.create({
  header: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 50,
    justifyContent: 'space-between',
  },
  icon: {
    width: toSize(24),
    height: toSize(24),
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContainer: {
    flex: 1,
    backgroundColor: 'white',
    marginHorizontal: toSize(16),
    flexDirection: 'row',
    alignItems: 'center',
  },
  profile: {
    width: toSize(64),
    height: toSize(64),
    borderRadius: 999,
    marginRight: toSize(16),
    backgroundColor: colors.ColorF0FFF9,
  },
  menu: {
    flexDirection: 'row',
    marginHorizontal: toSize(13),
    alignItems: 'center',
    justifyContent: 'center',
  },
  quit: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'red',
  },
});
