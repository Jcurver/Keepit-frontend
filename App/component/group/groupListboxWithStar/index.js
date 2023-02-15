import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  colors,
  globalStyle,
  screenWidth,
  toSize,
} from '../../../config/globalStyle';
import AppText from '../../common/appText';
import AppImage from '../../common/appImage';
import AppTouchable from '../../common/appTouchable';
import MyIcon from '../../../config/icon-font';
import { typeTranslation } from '../../../function/etc';
import Config from 'react-native-config';
import { image_medium } from '../../../constants/imageSize';
import Svg from '../../../asset/svg';

const GroupListboxWithStar = ({
  data,
  arrow,
  drag,
  onPress,
  onStarPress,
  isActive,
}) => {
  return (
    <View
      style={[
        styles.container,
        arrow && styles.arrowContainer,
        isActive && styles.active,
      ]}
    >
      <AppTouchable
        style={styles.touchContainer}
        onPress={onPress && onPress}
        onLongPress={drag && drag}
      >
        <View>
          <View style={styles.titleContainer}>
            {/* {data.usePrivate && <MyIcon name={'ic_lock'} style={styles.lock} />} */}
            <AppText size={12} color={colors.Color6B6A6A}>
              {typeTranslation(data.category)}
            </AppText>
          </View>
          <View style={globalStyle.flexRowCenter}>
            {data.isMaster && (
              <MyIcon
                name={'ic_mygroup'}
                size={toSize(12)}
                color={colors.primary}
                style={styles.master}
              />
            )}
            <AppText weight={'medium'} style={styles.groupName}>
              {data.name.length > 15
                ? data.name.substring(0, 15) + '...'
                : data.name}
            </AppText>
          </View>
          <View
            style={[
              styles.titleContainer,
              { marginTop: toSize(4), alignItems: 'center' },
            ]}
          >
            {Svg('ic_twoPerson')}
            <AppText
              style={{ marginLeft: toSize(4) }}
              size={12}
              color={colors.Color6B6A6A}
            >
              {data.participantCount}
            </AppText>
          </View>
        </View>
        {!arrow &&
          (data.profileUrl ? (
            <AppImage
              style={styles.groupPic}
              source={{
                uri: `${Config.IMAGE_SERVER_URI}/${data.profileUrl}${image_medium}`,
              }}
              size={toSize(17)}
              color={colors.ColorF4F4F4}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <MyIcon
                name={'keepit_logo'}
                size={toSize(17)}
                color={colors.ColorF4F4F4}
              />
            </View>
          ))}
      </AppTouchable>
      {arrow ? (
        <AppTouchable style={styles.starContainer} onLongPress={drag}>
          {Svg('ic_arrow_vertical')}
        </AppTouchable>
      ) : (
        <AppTouchable style={styles.starContainer} onPress={onStarPress}>
          {data.favorite ? (
            <MyIcon
              name={'ic_star'}
              size={toSize(20)}
              color={colors.ColorFEE500}
            />
          ) : (
            Svg('ic_star_empty')
          )}
        </AppTouchable>
      )}
    </View>
  );
};

export const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flexDirection: 'row',
    paddingHorizontal: toSize(16),
    borderRadius: 4,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: colors.ColorF4F4F4,
  },
  master: {
    marginRight: toSize(6),
  },
  active: {
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    elevation: 5,
  },
  touchContainer: {
    width: screenWidth - toSize(54),
    flexDirection: 'row',
    paddingHorizontal: toSize(6),
    paddingVertical: toSize(8),
    justifyContent: 'space-between',
  },
  titleContainer: {
    flexDirection: 'row',
    marginTop: toSize(6),
    marginBottom: toSize(4),
    alignItems: 'center',
  },
  lock: {
    marginRight: toSize(6),
    marginTop: toSize(1),
  },
  groupName: {
    maxHeight: toSize(20),
  },
  groupPic: {
    width: toSize(70),
    height: toSize(70),
    borderRadius: 6,
    alignSelf: 'center',
  },
  starContainer: {
    width: toSize(25),
    height: toSize(25),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  star: {
    width: toSize(18),
    height: toSize(18),
  },
  arrow: {
    width: toSize(24),
    height: toSize(24),
  },
  emptyContainer: {
    alignSelf: 'center',
    backgroundColor: colors.ColorC4C4C4,
    alignItems: 'center',
    justifyContent: 'center',
    width: toSize(70),
    height: toSize(70),
    borderRadius: 6,
  },
});

export default GroupListboxWithStar;
