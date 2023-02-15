import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { colors } from '../../../config/globalStyle';

const AlarmScrollView = ({ style, ...props }) => {
  return (
    <ScrollView
      style={[styles.alarmScroll, style]}
      bounces={false}
      {...props}
    />
  );
};

export default AlarmScrollView;

const styles = StyleSheet.create({
  alarmScroll: {
    backgroundColor: colors.ColorF5F5F5,
    width: '100%',
    height: '100%',
  },
});
