import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import {
  colors,
  globalStyle,
  images,
  screenWidth,
  toSize,
} from '../../../config/globalStyle';
import MyIcon from '../../../config/icon-font';
import AppImage from '../../common/appImage';
import AppText from '../../common/appText';
import Config from 'react-native-config';
import AppTouchable from '../../common/appTouchable';
import { image_small } from '../../../constants/imageSize';
import RootNavigation from '../../../RootNavigation';

const ProfileKeepReviewCard = ({
  data,
  index,
  choose,
  chooseList,
  setChooseList,
  setDeleteVisible,
}) => {
  const [select, setSelect] = useState(false);
  const [isKeep, setIsKeep] = useState();
  const [keepCount, setKeepCount] = useState();
  const [commentCount, setCommentCount] = useState();

  useEffect(() => {
    if (!choose) {
      setSelect(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [choose]);

  return (
    <AppTouchable
      style={{
        width: (screenWidth - toSize(39)) / 2,
        marginBottom: toSize(12),
        marginRight: toSize(7),
      }}
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
            RootNavigation.navigate('ReviewDetailScreen', {
              ids: {
                groupId: data.groupId,
                reviewId: data.reviewId,
                setIsKeep,
                setKeepCount,
                setCommentCount,
                fromKeep: true,
              },
            });
          }
        }
      }}
    >
      <View style={styles.imageContainer}>
        {data.imageUrl ? (
          <AppImage
            source={{
              uri: `${Config.IMAGE_SERVER_URI}/${data.imageUrl}${image_small}`,
            }}
            style={styles.image}
            icon={'ic_location_white'}
            size={toSize(48)}
            color={'white'}
          />
        ) : (
          <MyIcon name="ic_location_white" color={'white'} size={toSize(48)} />
        )}
      </View>

      {data.isDelete && <View style={styles.delete} />}

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
        <AppText
          color={data.isDelete ? colors.ColorA7A7A7 : colors.black}
          size={16}
          weight={'bold'}
          numberOfLines={1}
        >
          {data.isDelete && '(삭제된 게시글)'}
          {data.placeName}
        </AppText>

        <AppText
          style={{ marginVertical: toSize(4) }}
          size={12}
          color={data.isDelete ? colors.ColorA7A7A7 : colors.Color6B6A6A}
          numberOfLines={1}
        >
          {data.groupName}
        </AppText>

        <AppText
          size={12}
          color={data.isDelete ? colors.ColorA7A7A7 : colors.Color6B6A6A}
          numberOfLines={1}
        >
          {data.memberName +
            '   ' +
            data.createDt?.substring(0, 10).replaceAll('-', '.')}
        </AppText>
      </View>
    </AppTouchable>
  );
};

export const styles = StyleSheet.create({
  imageContainer: {
    width: (screenWidth - toSize(39)) / 2,
    height: toSize(164),
    borderRadius: 6,
    backgroundColor: colors.ColorC4C4C4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  delete: {
    width: (screenWidth - toSize(39)) / 2,
    height: toSize(164),
    borderRadius: 6,
    backgroundColor: colors.ColorEBEBEB75,
    position: 'absolute',
  },
  choose: {
    backgroundColor: colors.ColorD2D2D26E,
    width: toSize(24),
    height: toSize(24),
    position: 'absolute',
    left: toSize(8),
    top: toSize(8),
    borderRadius: 999,
    borderWidth: 2,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },

  image: {
    width: (screenWidth - toSize(39)) / 2,
    height: toSize(164),
    borderRadius: 6,
  },
  infoContainer: {
    paddingHorizontal: toSize(4),
    paddingVertical: toSize(8),
  },
});

export default ProfileKeepReviewCard;
