import { StyleSheet } from 'react-native';
import { colors, toSize } from '../../../config/globalStyle';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: toSize(16),
    paddingVertical: toSize(8),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileContainer: {
    flex: 1,
    flexDirection: 'row',
    // justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    flex: 1,
  },
  emptyProfile: {
    width: toSize(64),
    height: toSize(64),
    backgroundColor: colors.ColorF0FFF9,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginRight: toSize(12),
  },
  profile: {
    width: toSize(56),
    height: toSize(56),
    marginRight: toSize(10),
  },
  infoContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: toSize(25),
    paddingHorizontal: toSize(80),
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: toSize(8),
  },
  infoBox: {
    alignItems: 'center',
    // justifyContent: 'center',
  },
  menuContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginBottom: toSize(1),
    paddingVertical: toSize(21),
    paddingHorizontal: toSize(16),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
