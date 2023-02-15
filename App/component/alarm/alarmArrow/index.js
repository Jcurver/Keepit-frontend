import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { EasingNode } from 'react-native-reanimated';
import Svg from '../../../asset/svg';
import { colors, toSize } from '../../../config/globalStyle';
import AppTouchable from '../../common/appTouchable';

const AlarmArrow = ({ onPress, isBlocked = false }) => {
  return (
    <AppTouchable style={styles.svg} onPress={isBlocked ? undefined : onPress}>
      {Svg('back_thin')}
    </AppTouchable>
  );
};

export default AlarmArrow;

const styles = StyleSheet.create({
  svg: {
    transform: [{ rotateZ: '180deg' }],
    padding: toSize(8),
    marginRight: toSize(5),
  },
});
