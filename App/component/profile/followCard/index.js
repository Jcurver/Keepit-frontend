import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import {
  colors,
  globalStyle,
  images,
  toSize,
} from '../../../config/globalStyle';
import AppImage from '../../common/appImage';
import Svg from '../../../asset/svg';
import AppText from '../../common/appText';
import AppTouchable from '../../common/appTouchable';
import MyIcon from '../../../config/icon-font';
import Config from 'react-native-config';
import { image_small } from '../../../constants/imageSize';
import RootNavigation from '../../../RootNavigation';

const ProfileFollowCard = ({ data, onPressStar }) => {
  const [follow, setFollow] = useState(true);

  return (
    <AppTouchable
      style={styles.container}
      onPress={() =>
        RootNavigation.navigate('GroupUserScreen', {
          groupId: data.groupId,
          mid: data.memberMid,
        })
      }
    >
      {data.profileUrl ? (
        <AppImage
          style={styles.emptyProfile}
          source={{
            uri: `${Config.IMAGE_SERVER_URI}/${data.profileUrl}${image_small}`,
          }}
          size={toSize(20)}
          color={colors.ColorAEE9D2}
        />
      ) : (
        <View style={styles.emptyProfile}>
          <MyIcon
            name={'profile_empty'}
            size={toSize(20)}
            color={colors.ColorAEE9D2}
          />
        </View>
      )}
      <View style={styles.infoContainer}>
        <AppText
          size={16}
          style={styles.title}
          color={data.isWithdrawal && colors.ColorA7A7A7}
          numberOfLines={2}
        >
          {data.isWithdrawal && '(탈퇴 멤버)'}
          {data.memberName}
        </AppText>
        <AppText
          style={styles.date}
          size={12}
          color={data.isWithdrawal ? colors.ColorA7A7A7 : colors.Color6B6A6A}
        >
          {/* {data.isWithdrawal && '(탈퇴 멤버)'} */}
          {data.groupName}
        </AppText>
      </View>
      <AppTouchable style={styles.star} onPress={onPressStar}>
        <MyIcon name={'ic_star'} size={toSize(20)} color={colors.ColorFEE500} />
      </AppTouchable>
    </AppTouchable>
  );
};

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: toSize(12),
    // marginHorizontal: toSize(16),
    borderBottomWidth: 1,
    borderColor: colors.ColorE5E5E5,
    alignItems: 'center',
  },
  emptyProfile: {
    width: toSize(42),
    height: toSize(42),
    backgroundColor: colors.ColorF0FFF9,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginRight: toSize(12),
  },
  title: {
    maxHeight: toSize(50),
    lineHeight: toSize(24),
  },
  date: {
    marginVertical: toSize(4),
  },
  infoContainer: {
    flex: 1,
    marginRight: toSize(14),
    justifyContent: 'center',
  },
  star: {
    width: toSize(24),
    height: toSize(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileFollowCard;
