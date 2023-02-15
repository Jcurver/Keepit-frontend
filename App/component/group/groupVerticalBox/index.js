import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { colors, images, toSize } from '../../../config/globalStyle';
import MyIcon from '../../../config/icon-font';
import { typeTranslation } from '../../../function/etc';
import AppText from '../../common/appText';
import AppTouchable from '../../common/appTouchable';
import AppImage from '../../common/appImage';
import Svg from '../../../asset/svg';
import { image_medium } from '../../../constants/imageSize';
import Config from 'react-native-config';
import Skeleton from '../../common/skeleton';

const GroupVerticalBox = ({ data, onPress }) => {
  return (
    <AppTouchable style={styles.container} onPress={onPress}>
      {data?.profileUrl ? (
        <AppImage
          style={styles.image}
          source={{
            uri: `${Config.IMAGE_SERVER_URI}/${data?.profileUrl}${image_medium}`,
          }}
          size={toSize(26)}
          color={colors.ColorF4F4F4}
        />
      ) : data ? (
        <View style={styles.imageContainer}>
          <MyIcon
            name={'keepit_logo'}
            size={toSize(26)}
            color={colors.ColorF4F4F4}
          />
        </View>
      ) : (
        <Skeleton width={140} height={99} style={{ borderRadius: 6 }} noStyle />
      )}
      <View style={styles.titleContainer}>
        {data?.usePrivate && <MyIcon name={'ic_lock'} style={styles.lock} />}
        <AppText
          size={12}
          color={colors.Color6B6A6A}
          isData={data}
          sWidth={67}
          sHeight={16}
          noStyle
        >
          {typeTranslation(data?.category)}
        </AppText>
      </View>
      <AppText
        weight={'medium'}
        style={styles.groupName}
        isData={data}
        viewStyle={{ paddingLeft: toSize(4) }}
        sWidth={132}
        sHeight={16}
        noStyle
      >
        {data?.name}
      </AppText>
      <View style={styles.titleContainer}>
        {data && Svg('ic_twoPerson')}
        <AppText
          style={{ marginLeft: toSize(3) }}
          size={12}
          color={colors.Color6B6A6A}
          isData={data}
          sWidth={94}
          sHeight={16}
          noStyle
        >
          {data?.participantCount}
        </AppText>
      </View>
    </AppTouchable>
  );
};

export const styles = StyleSheet.create({
  container: {
    width: toSize(140),
    height: toSize(201),
    // borderWidth: 1,
    // borderColor: colors.ColorE5E5E5,
    borderRadius: 4,
    marginRight: toSize(8),
  },
  active: {
    backgroundColor: colors.black,
    borderColor: colors.black,
  },
  image: {
    width: toSize(138),
    height: toSize(99),
    borderRadius: 4,
  },
  imageContainer: {
    width: toSize(138),
    height: toSize(99),
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.ColorC4C4C4,
  },
  titleContainer: {
    flexDirection: 'row',
    marginLeft: toSize(4),
    marginTop: toSize(4),
    marginBottom: toSize(4),
    alignItems: 'center',
  },
  lock: {
    marginRight: toSize(6),
    marginTop: toSize(1),
  },
  groupName: {
    marginHorizontal: toSize(4),
    maxHeight: toSize(60),
  },
});

export default GroupVerticalBox;
