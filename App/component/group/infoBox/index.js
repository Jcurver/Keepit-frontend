import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import {
  colors,
  globalStyle,
  images,
  screenWidth,
  toSize,
} from '../../../config/globalStyle';
import AppText from '../../common/appText';
import AppTouchable from '../../common/appTouchable';
import MyIcon from '../../../config/icon-font';
import { typeTranslation } from '../../../function/etc';
import Config from 'react-native-config';
import Svg from '../../../asset/svg';
import AppImage from '../../common/appImage';
import { image_small } from '../../../constants/imageSize';
import Skeleton from '../../common/skeleton';

const GroupInfoBox = ({ data, onPress, fromSearch }) => {
  return (
    <AppTouchable style={styles.container} onPress={onPress}>
      {data?.profileUrl ? (
        <AppImage
          style={styles.groupPic}
          source={{
            uri: `${Config.IMAGE_SERVER_URI}/${data?.profileUrl}${image_small}`,
          }}
          size={toSize(16)}
        />
      ) : data ? (
        <View style={[globalStyle.empty, styles.groupPic]}>
          <MyIcon
            name={'keepit_logo'}
            size={toSize(16)}
            color={colors.ColorF4F4F4}
          />
        </View>
      ) : (
        <Skeleton
          width={70}
          height={70}
          noStyle
          viewStyle={{ marginRight: toSize(12) }}
        />
      )}
      <View>
        <View style={styles.titleContainer}>
          {data?.usePrivate && <MyIcon name={'ic_lock'} style={styles.lock} />}
          <AppText
            size={12}
            color={colors.Color6B6A6A}
            isData={data}
            noStyle
            sWidth={67}
            sHeight={16}
          >
            {typeTranslation(data?.category)}
          </AppText>
        </View>
        <View style={globalStyle.flexRow}>
          {data?.isMaster && (
            <Image style={{ alignSelf: 'center' }} source={images.ic_myGroup} />
          )}
          <AppText
            weight={'medium'}
            numberOfLines={1}
            style={styles.groupName}
            isData={data}
            // noStyle
            sWidth={258}
            sHeight={16}
          >
            {data?.name}
          </AppText>
        </View>
        <View style={styles.titleContainer}>
          {data && Svg('ic_twoPerson')}
          <AppText
            style={{ marginLeft: toSize(4) }}
            size={12}
            color={colors.Color6B6A6A}
            isData={data}
            noStyle
            sWidth={94}
            sHeight={16}
          >
            {data?.participantCount}
          </AppText>
        </View>
      </View>
    </AppTouchable>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'row',
    height: toSize(95),
    borderBottomWidth: 1,
    borderColor: colors.ColorF4F4F4,
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    marginTop: toSize(4),
    marginBottom: toSize(4),
    alignItems: 'center',
  },
  lock: {
    marginRight: toSize(6),
    marginTop: toSize(1),
  },
  groupName: {
    width: (screenWidth * 258) / 375,
    maxHeight: toSize(20),
  },
  groupPic: {
    width: toSize(70),
    height: toSize(70),
    borderRadius: toSize(6),
    marginRight: toSize(12),
  },
  empty: {
    backgroundColor: colors.ColorC4C4C4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starContainer: {
    alignSelf: 'center',
  },
  star: {
    width: toSize(18),
    height: toSize(18),
  },
  arrow: {
    width: toSize(24),
    height: toSize(24),
  },
});

export default GroupInfoBox;
