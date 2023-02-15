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
import { image_small } from '../../../constants/imageSize';
import Config from 'react-native-config';
import RootNavigation from '../../../RootNavigation';

const ProfileKeepDailyCard = ({
  data,
  choose,
  chooseList,
  setChooseList,
  setDeleteVisible,
}) => {
  const [select, setSelect] = useState(false);
  const [commentCount, setCommentCount] = useState();

  return (
    <AppTouchable
      style={styles.container}
      onPress={() => {
        if (choose) {
          if (select) {
            const filter = chooseList.filter((list) => list !== data.seq);
            setChooseList(filter);
          } else {
            const chooseData = data.seq;
            setChooseList([chooseData, ...chooseList]);
          }
          setSelect((state) => !state);
        } else {
          if (data.isDelete) {
            setDeleteVisible(true);
          } else {
            RootNavigation.navigate('DailyDetailScreen', {
              ids: {
                groupId: data.groupId,
                dailyId: data.dailyId,
                setCommentCount,
                fromKeep: true,
              },
            });
          }
        }
      }}
    >
      {data.imageUrl && !choose && (
        <AppImage
          source={{
            uri: `${Config.IMAGE_SERVER_URI}/${data?.imageUrl}${image_small}`,
          }}
          style={styles.profile}
        />
      )}

      {choose && (
        <View
          style={[styles.choose, select && { backgroundColor: colors.primary }]}
        >
          {select && (
            <MyIcon
              name={'ic_check_white'}
              size={toSize(9.5)}
              color={'white'}
            />
          )}
        </View>
      )}

      <View style={styles.infoContainer}>
        <AppText size={16} style={styles.title} numberOfLines={1}>
          {data.title}
        </AppText>

        <AppText style={styles.date} size={12} color={colors.Color6B6A6A}>
          {data.groupName}
        </AppText>
        <View style={styles.commentContainer}>
          <AppText size={12} color={colors.Color6B6A6A}>
            {data.memberName + '  '}
            {data.createDt?.substring(0, 10).replaceAll('-', '.')}
          </AppText>
        </View>
        <View style={[globalStyle.flexRow, { alignItems: 'center' }]}>
          <MyIcon
            size={toSize(10)}
            name={'ic_message'}
            color={colors.ColorC1C1C1}
          />
          <AppText
            style={{ marginLeft: toSize(5) }}
            size={12}
            color={colors.Color6B6A6A}
          >
            {data.commentCount}
          </AppText>
        </View>
      </View>
    </AppTouchable>
  );
};

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: toSize(8),
    // marginHorizontal: toSize(16),
    borderBottomWidth: 1,
    borderColor: colors.ColorF4F4F4,
    // alignItems: 'center',
  },
  profile: {
    width: toSize(68),
    height: toSize(68),
    borderRadius: 4,
    // marginTop: toSize(8),
    marginRight: toSize(12),
  },
  groupPic: {
    width: toSize(80),
    height: toSize(80),
    borderRadius: toSize(4),
    marginRight: toSize(6),
  },
  empty: {
    backgroundColor: colors.ColorE5E5E5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyProfile: {
    width: toSize(68),
    height: toSize(72),
    borderRadius: 4,
    backgroundColor: colors.ColorE5E5E5,
    margin: toSize(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    maxHeight: toSize(36),
    lineHeight: toSize(24),
  },
  date: {
    marginVertical: toSize(4),
  },
  commentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: toSize(4),
  },
  infoContainer: {
    flex: 1,
  },
  choose: {
    backgroundColor: colors.ColorD2D2D26E,
    width: toSize(24),
    height: toSize(24),
    borderRadius: 999,
    borderWidth: 2,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginHorizontal: toSize(12),
  },
});

export default ProfileKeepDailyCard;
