import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { colors, toSize } from '../../../config/globalStyle';
import AppText from '../../common/appText';

const AlarmContentTitle = ({ style, text, ...props }) => {
  return (
    <View style={[styles.contentTitle, style]} {...props}>
      <AppText weight="bold" style={styles.text}>
        {text}
      </AppText>
    </View>
  );
};

export default AlarmContentTitle;

const styles = StyleSheet.create({
  contentTitle: {
    width: '100%',
    height: toSize(48),
    position: 'relative',
  },
  text: {
    position: 'absolute',
    bottom: toSize(6),
    left: toSize(16),
  },
});
