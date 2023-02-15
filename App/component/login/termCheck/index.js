import React, { useEffect, useState } from 'react';
import { Image, View } from 'react-native';
import AppText from '../../common/appText';
import { styles } from './styles';
import CheckBox from '@react-native-community/checkbox';
import { colors, images, toSize } from '../../../config/globalStyle';
import AppTouchable from '../../common/appTouchable';
import MyIcon from '../../../config/icon-font';
import Svg from '../../../asset/svg';

const TermCheck = ({
  total,
  essential,
  value,
  onValueChange,
  title,
  linking,
}) => {
  return (
    <View style={[styles.container, !total && { marginVertical: toSize(7) }]}>
      <AppTouchable style={styles.content} onPress={onValueChange} opacity={1}>
        <View
          style={[
            total ? styles.totalBox : styles.box,
            value &&
              total && {
                borderColor: colors.primary,
                backgroundColor: colors.primary,
              },
          ]}
          onPress={onValueChange}
        >
          <MyIcon
            name={'ic_check_white'}
            size={toSize(10)}
            color={
              value ? (total ? 'white' : colors.primary) : colors.ColorE5E5E5
            }
          />
        </View>
        <View>
          <AppText
            size={total ? 16 : 14}
            weight={essential && !total && 'medium'}
          >
            {title}
          </AppText>
        </View>
      </AppTouchable>
      {!total && (
        <AppTouchable onPress={linking}>{Svg('forward_thin')}</AppTouchable>
      )}
    </View>
  );
};

export default TermCheck;
