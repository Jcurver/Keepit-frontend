import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { EasingNode } from 'react-native-reanimated';
import { colors, toSize } from '../../../config/globalStyle';
import AppTouchable from '../../common/appTouchable';

const ToggleSwitch = ({ toggleState = true, onPress }) => {
  const toggleBackgroundColor = toggleState
    ? colors.primary
    : colors.ColorEEEEEE;
  const [aniValue, _] = useState(new Animated.Value(toggleState ? 1 : 0));

  const toggleX = aniValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 20],
  });
  Animated.timing(aniValue, {
    toValue: toggleState ? 1 : 0,
    duration: 100,
    easing: EasingNode.linear,
    useNativeDriver: true,
  }).start();

  return (
    <AppTouchable onPress={onPress}>
      <View
        style={[
          styles.toggleBackground,
          dstyles(toggleBackgroundColor).toggleBg,
        ]}
      >
        <Animated.View
          style={[styles.toggleBall, { transform: [{ translateX: toggleX }] }]}
        />
      </View>
    </AppTouchable>
  );
};

export default ToggleSwitch;

const styles = StyleSheet.create({
  headerStyle: {
    fontWeight: 'bold',
  },
  toggleBackground: {
    width: toSize(52),
    height: toSize(32),
    justifyContent: 'center',
    paddingHorizontal: toSize(2),
    borderRadius: toSize(16),
    // backgroundColor: colors.ColorEEEEEE,
  },
  toggleBall: {
    width: toSize(28),
    height: toSize(28),
    backgroundColor: 'white',
    borderRadius: 999,
  },
});
const dstyles = (toggleBackgroundColor) =>
  StyleSheet.create({
    toggleBg: {
      backgroundColor: toggleBackgroundColor,
    },
  });
