import { WINDOW_WIDTH } from '@gorhom/bottom-sheet';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg from 'asset/svg';

import { colors, toSize } from '../../../../config/globalStyle';
import AppImage from '../../../common/appImage';
import AppText from '../../../common/appText';
import AppTouchable from '../../../common/appTouchable';

const FollowingMemberCard = ({ memberName, groupName, alarmYn, onPress }) => {
  const [isAlarmOn, setIsAlarmOn] = useState(alarmYn);

  return (
    <View style={styles.container}>
      <View style={styles.imageView}>{Svg('noti_empty_profile')}</View>
      <View style={styles.textContainer}>
        <AppText size={16} numberOfLines={2}>
          {memberName}
        </AppText>
        <AppText
          size={12}
          color={colors.Color6B6A6A}
          style={styles.padding}
          numberOfLines={1}
        >
          {groupName}
        </AppText>
      </View>
      <AppTouchable style={styles.alarmImageView} onPress={onPress}>
        {alarmYn ? Svg('alarm_on') : Svg('alarm_off')}
      </AppTouchable>
    </View>
  );
};

export default FollowingMemberCard;

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: toSize(16),
    paddingVertical: toSize(12),
    flexDirection: 'row',
  },
  imageView: {
    justifyContent: 'center',
    width: toSize(40),
  },
  alarmImageView: {
    justifyContent: 'center',
    width: toSize(34),
  },
  image: {
    width: toSize(40),
    height: toSize(40),
    borderRadius: 999,
  },
  textContainer: {
    width: WINDOW_WIDTH - toSize(106),
    paddingLeft: toSize(12),
    paddingRight: toSize(12),
  },
  padding: {
    paddingTop: toSize(4),
  },
});
