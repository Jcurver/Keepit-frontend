import React from 'react';
import { View, StyleSheet } from 'react-native';
import { toSize } from '../../../config/globalStyle';

const AlarmMargin = () => {
  return <View style={styles.margin} />;
};
export default AlarmMargin;

const styles = StyleSheet.create({
  margin: {
    width: '100%',
    height: toSize(26),
  },
});
