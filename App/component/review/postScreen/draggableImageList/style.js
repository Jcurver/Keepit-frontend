import { StyleSheet } from 'react-native';
import { colors, toSize } from '../../../../config/globalStyle';

export const styles = StyleSheet.create({
  imageSelectScrollView: {
    flexDirection: 'row',
    marginLeft: toSize(16),
    paddingTop: toSize(6),
    marginBottom: toSize(16),
  },
  imageSelectButton: {
    width: toSize(84),
    height: toSize(84),
    borderRadius: toSize(4),
    marginRight: toSize(20),
    backgroundColor: colors.Color6B6A6A,
    paddingTop: toSize(10),
    marginTop: toSize(12),

    justifyContent: 'center',
    alignItems: 'center',
  },
  imageSelectButtonText: {
    color: 'white',
    marginTop: toSize(11),
  },
  image: {
    width: toSize(84),
    height: toSize(84),
    borderRadius: toSize(4),
    marginRight: toSize(20),
    resizeMode: 'cover',
    alignSelf: 'center',
    justifyContent: 'center',
    borderWidth: toSize(1),
    borderColor: colors.ColorE5E5E5,
  },
  imageContainer: {
    position: 'relative',
  },
  imageCloseIconView: {
    position: 'absolute',
    backgroundColor: colors.Color191919,
    width: toSize(24),
    height: toSize(24),
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    right: toSize(15),
    top: toSize(-9),
    zIndex: 100,
  },
  firstImage: {
    position: 'absolute',
    backgroundColor: colors.Color191919,
    width: toSize(34),
    height: toSize(22),
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: toSize(4),
    bottom: toSize(1),
    left: toSize(1),
  },
  imageHover: {
    borderColor: colors.Color2D2F30,
    borderWidth: toSize(2),
  },
  flatListStyle: {
    paddingTop: toSize(12),
  },
  safeAreaView: {
    flex: 1,
  },
});
