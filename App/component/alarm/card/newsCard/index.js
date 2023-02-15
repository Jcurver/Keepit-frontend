import { WINDOW_WIDTH } from '@gorhom/bottom-sheet';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Svg from '../../../../asset/svg';

import { colors, toSize } from '../../../../config/globalStyle';
import writtenDate from '../../../../function/writtenDate';
import AppImage from '../../../common/appImage';
import AppText from '../../../common/appText';

const NewsCard = ({ data, isLoading = false }) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageView}>{Svg('noti_keepit')}</View>
      <View style={styles.textContainer}>
        <AppText size={14} numberOfLines={2} isData={!isLoading} sWidth={260}>
          {data?.notiContent}
        </AppText>
        <AppText
          size={12}
          color={colors.Color6B6A6A}
          numberOfLines={1}
          isData={!isLoading}
          sWidth={40}
        >
          {writtenDate(data?.notiDate)}
        </AppText>
      </View>
    </View>
  );
};

export default NewsCard;

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingLeft: toSize(16),
    paddingVertical: toSize(12),
    flexDirection: 'row',
  },
  imageView: {
    justifyContent: 'center',
  },
  image: {
    width: toSize(40),
    height: toSize(40),
    borderRadius: 999,
  },
  textContainer: {
    width: WINDOW_WIDTH - toSize(52),
    paddingLeft: toSize(12),
    paddingRight: toSize(22),
  },
  padding: {
    paddingVertical: toSize(4),
  },
});
