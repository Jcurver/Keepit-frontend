import { WINDOW_WIDTH } from '@gorhom/bottom-sheet';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { withStyleAnimation } from 'react-native-reanimated/lib/types/lib/reanimated2/animation';
import Svg from '../../../asset/svg';

import { colors, toSize } from '../../../config/globalStyle';
import AppText from '../../common/appText';
import AppTouchable from '../../common/appTouchable';
import AlarmArrow from '../alarmArrow';
import ToggleSwitch from '../ToggleSwitch';

const AlarmContent = ({
  arrow = false,
  arrowPress,
  style,
  mainText,
  subText,
  toggleState = false,
  isBlocked = false,
  onTogglePress,
  ...props
}) => {
  if (arrow) {
    return (
      <TouchableWithoutFeedback
        style={[styles.content, style, isBlocked && styles.blocked]}
        onPress={isBlocked ? () => {} : arrowPress}
        {...props}
        opacity={0.6}
      >
        <View style={styles.textView}>
          <AppText size={16} style={styles.mainText} numberOfLines={1}>
            {mainText}
          </AppText>
          {subText && <AppText style={styles.subText}>{subText}</AppText>}
        </View>
        <AlarmArrow onPress={arrowPress} isBlocked={isBlocked} />
      </TouchableWithoutFeedback>
    );
  }
  return (
    <View
      style={[styles.content, style, isBlocked && styles.blocked]}
      {...props}
    >
      <View style={styles.textView}>
        <AppText size={16} style={styles.mainText} numberOfLines={1}>
          {mainText}
        </AppText>
        {subText && <AppText style={styles.subText}>{subText}</AppText>}
      </View>
      <ToggleSwitch
        onPress={isBlocked ? () => {} : onTogglePress}
        toggleState={toggleState}
        isBlocked={isBlocked}
      />
    </View>
  );
};

export default AlarmContent;

const styles = StyleSheet.create({
  content: {
    backgroundColor: 'white',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: toSize(16),
    paddingVertical: toSize(8),
    marginBottom: toSize(1.5),
    flexDirection: 'row',
  },
  textView: {
    flexDirection: 'column',
  },
  blocked: {
    backgroundColor: 'white',
    width: '100%',
    opacity: 0.6,
  },
  mainText: {
    width: WINDOW_WIDTH - toSize(100),
  },
  subText: {},
});
