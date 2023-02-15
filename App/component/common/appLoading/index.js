import React, { memo } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, toSize } from '../../../config/globalStyle';

const AppLoading = ({
  overlay = true,
  transparent = false,
  indicatorColor = colors.white,
  style,
  children,
}) => {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.container,
        overlay && { ...styles.overlay, top: -1 * insets?.top },
        transparent ? styles.transparent : styles.shadow,
        style,
      ]}
    >
      <ActivityIndicator size={'large'} color={indicatorColor} />
      {children && children}
    </View>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -toSize(34),
  },
  transparent: {
    backgroundColor: colors.transparent,
  },
  shadow: {
    backgroundColor: colors.black60,
  },
});

export default memo(AppLoading);
