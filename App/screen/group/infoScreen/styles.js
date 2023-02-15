import { StyleSheet } from 'react-native';
import { toSize } from '../../../config/globalStyle';

export const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    margin: 0,
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 50,
  },
  leftButton: {
    width: toSize(44),
    height: toSize(44),
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: toSize(44),
    height: toSize(44),
    alignItems: 'center',
    justifyContent: 'center',
  },
  collapsible: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupProfile: {
    marginTop: toSize(16),
    marginBottom: toSize(10),
    width: toSize(96),
    height: toSize(96),
    borderRadius: 999,
  },
  menu: {
    marginHorizontal: toSize(13),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
