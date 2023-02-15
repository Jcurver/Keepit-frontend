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
import { image_medium } from '../../../constants/imageSize';
import { callApi } from '../../../function/auth';
import { postMembersBlock } from '../../../api/user';
import updateSameText from '../../../function/updateSameText';

const ProfileBlockCard = ({ data, setToastText, onRefresh }) => {
  const handleBlock = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      setToastText((text) => updateSameText('차단 해제되었어요.', text));
      onRefresh();
    }
  };

  return (
    <View style={styles.container}>
      {data.profileUrl ? (
        <AppImage
          style={styles.emptyProfile}
          source={{
            uri: `${Config.IMAGE_SERVER_URI}/${data.profileUrl}${image_medium}`,
          }}
          size={toSize(17)}
          color={colors.ColorF4F4F4}
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
        <AppText size={16} style={styles.title} numberOfLines={2}>
          {data.memberName}
        </AppText>
        <AppText style={styles.date} size={12} color={colors.Color6B6A6A}>
          {data.groupName}
        </AppText>
      </View>

      <AppTouchable
        style={styles.btnContainer}
        onPress={() =>
          callApi(postMembersBlock, { targetMid: data.memberMid }, handleBlock)
        }
      >
        <AppText
          size={14}
          weight={'medium'}
          color={colors.primary}
          style={styles.button}
        >
          차단해제
        </AppText>
      </AppTouchable>
    </View>
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
  },
  btnContainer: {
    borderRadius: 6,
    backgroundColor: colors.ColorF0FFF9,
  },
  button: {
    marginVertical: toSize(8),
    marginHorizontal: toSize(12),
  },
});

export default ProfileBlockCard;
