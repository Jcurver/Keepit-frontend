import { WINDOW_WIDTH } from '@gorhom/bottom-sheet';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Config from 'react-native-config';
import Svg from '../../../../asset/svg';
import { colors, toSize } from '../../../../config/globalStyle';
import writtenDate from '../../../../function/writtenDate';
import AppImage from '../../../common/appImage';
import AppText from '../../../common/appText';

const ActivityCard = ({ data, isLoading = false }) => {
  const imageURL = Config.IMAGE_SERVER_URI + '/' + data?.imageUrl;

  return (
    <View style={styles.container}>
      <View style={styles.imageView}>
        {data?.imageUrl ? (
          <Image style={styles.image} source={{ uri: imageURL }} />
        ) : data?.notificationType === 'KPS_GE' ? (
          Svg('noti_exit')
        ) : (
          Svg('noti_keepit')
        )}
      </View>
      <View style={styles.textContainer}>
        <AppText size={14} numberOfLines={2} isData={!isLoading} sWidth={260}>
          {data?.notiContent}
        </AppText>
        <AppText
          size={12}
          color={colors.Color6B6A6A}
          style={styles.padding}
          numberOfLines={1}
          isData={!isLoading}
          sWidth={100}
        >
          {data?.groupName}
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

export default ActivityCard;

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
    width: toSize(42),
    height: toSize(42),
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
