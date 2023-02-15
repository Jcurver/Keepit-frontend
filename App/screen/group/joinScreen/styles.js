import { StyleSheet } from 'react-native';
import { colors, screenWidth, toSize } from '../../../config/globalStyle';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backGroup: {
    height: toSize(191),
    width: '100%',
    // resizeMode: 'contain',
    zIndex: 100,
    position: 'absolute',
  },
  gradient: {
    zIndex: 101,
    height: toSize(191),
  },
  empty: {
    height: toSize(191),
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.ColorC4C4C4,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: toSize(24),
    paddingTop: toSize(24),
  },
  title: {
    marginTop: toSize(14),
  },
  content: {
    marginTop: toSize(14),
  },
  category: {
    borderWidth: 1,
    borderRadius: 24,
    borderColor: colors.primary,
    backgroundColor: colors.ColorF0FFF9,
    paddingVertical: toSize(6),
    paddingHorizontal: toSize(12),
    alignSelf: 'flex-start',
  },
  personNum: {
    marginTop: toSize(14),
    flexDirection: 'row',
    alignItems: 'center',
  },
  joinNum: {
    marginLeft: toSize(10),
  },
  profile: {
    width: toSize(32),
    height: toSize(32),
    borderRadius: 999,
    backgroundColor: colors.ColorF0FFF9,
  },
  circle: {
    marginTop: toSize(14),
    flexDirection: 'row',
    alignItems: 'center',
  },
  joinBtn: {
    backgroundColor: colors.primary,
    marginHorizontal: toSize(16),
    marginVertical: toSize(12),
  },
});
