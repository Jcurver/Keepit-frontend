import { WINDOW_WIDTH } from '@gorhom/bottom-sheet';
import React from 'react';

import { Image, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { toSize } from '../../config/globalStyle';
import AppImage from '../common/appImage';
import AppText from '../common/appText';

// const PageItem = styled.View`
//   background-color: ${(props) => props.color};
//   justify-content: center;
//   align-items: center;
//   border-radius: 20px;
// `;

// const PageNum = styled.Text``;

export default function Page({ item, style }) {
  const imageUrl =
    item.num === 1
      ? require('../../asset/onboarding1.png')
      : item.num === 2
      ? require('../../asset/onboarding2.png')
      : item.num === 3
      ? require('../../asset/onboarding3.png')
      : require('../../asset/onboarding4.png');
  return (
    <View
      color={item.color}
      style={[styles.pageItem, { backgroundColor: item.color }, style]}
    >
      <Image
        style={{ width: item.imageWidth, height: toSize(280) }}
        source={imageUrl}
      />

      <View style={styles.textContainer}>
        <AppText weight="bold" size={24} style={{ marginBottom: toSize(8) }}>
          {item.mainText}
        </AppText>
        <AppText size={16}>{item.subText}</AppText>
        <AppText size={16}>{item.subText2}</AppText>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  pageItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    width: WINDOW_WIDTH,
    // backgroundColor: 'red',
    alignItems: 'center',
    marginTop: toSize(43),
  },
  imageContainer: {
    width: WINDOW_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
