import { StyleSheet } from 'react-native';
import { colors, screenWidth, toSize } from '../../../config/globalStyle';

export const styles = StyleSheet.create({
  imageContainer: {
    width: screenWidth,
    height: toSize(155),
    alignSelf: 'center',
    marginBottom: toSize(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupImage: {
    width: screenWidth,
    height: toSize(155),
    resizeMode: 'cover',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  temp: {
    position: 'absolute',
    width: toSize(46),
    height: toSize(46),
    borderRadius: 6,
    backgroundColor: colors.black60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    // position: 'absolute',
    alignSelf: 'center',
    justifyContent: 'center',
    // marginTop: 10,
    // borderWidth: 1,
    // borderColor: colors.Color2D2F30,
  },
  emptyContainer: {
    backgroundColor: colors.ColorC4C4C4,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    marginHorizontal: toSize(16),
  },
  titleContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    height: toSize(48),
    borderColor: colors.ColorE5E5E5,
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: toSize(16),
    marginTop: toSize(10),
    justifyContent: 'space-between',
  },
  textContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    marginBottom: toSize(5),
  },
  error: {
    paddingTop: toSize(6),
    height: toSize(33),
  },
  count: {
    flex: 1,
    flexDirection: 'row',
    height: toSize(48),
    borderWidth: 1,
    borderColor: colors.ColorE5E5E5,
    borderRadius: 14,
    marginVertical: toSize(10),
    paddingHorizontal: toSize(16),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: toSize(9),
    marginBottom: toSize(26),
  },
  queryButton: {
    marginBottom: toSize(24),
    backgroundColor: colors.primary,
  },
});
