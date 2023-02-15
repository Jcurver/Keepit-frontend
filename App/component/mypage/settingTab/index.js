import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg from '../../../asset/svg';
import { toSize } from '../../../config/globalStyle';
import AppText from '../../common/appText';
import AppTouchable from '../../common/appTouchable';

const MypageSettingTab = ({ title, onPress, style, noIcon }) => {
  return (
    <AppTouchable style={[styles.container, style]} onPress={onPress}>
      <AppText style={styles.title} size={16}>
        {title}
      </AppText>
      {!noIcon && Svg('ic_next', { marginRight: toSize(5) })}
    </AppTouchable>
  );
};

export default MypageSettingTab;

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: toSize(16),
    marginBottom: toSize(1),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    marginVertical: toSize(12),
  },
});
