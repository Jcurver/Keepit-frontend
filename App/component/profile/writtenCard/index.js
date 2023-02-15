import { isEmpty } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import {
  colors,
  globalStyle,
  images,
  toSize,
} from '../../../config/globalStyle';
import MyIcon from '../../../config/icon-font';
import AppImage from '../../common/appImage';
import AppText from '../../common/appText';
import AppTouchable from '../../common/appTouchable';
import { image_small } from '../../../constants/imageSize';
import Config from 'react-native-config';
import RootNavigation from '../../../RootNavigation';
import { useFocusEffect } from '@react-navigation/native';

const ProfileWrittenCard = ({ data, daily, comment }) => {
  const [commentCount, setCommentCount] = useState();
  const [commentCountShow, setCommentCountShow] = useState(0);
  const [keepCount, setKeepCount] = useState();

  useEffect(() => {
    setCommentCount(data.commentCount);
    setKeepCount(data.keepCount);
    console.log(data.status);
  }, [data]);

  useFocusEffect(
    useCallback(() => {
      setCommentCountShow(commentCount);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [commentCount]),
  );

  const onPress = () => {
    if (daily) {
      RootNavigation.navigate('DailyDetailScreen', {
        ids: {
          groupId: data.groupId,
          dailyId: data.dailyId,
          setCommentCount,
          fromProfile: true,
        },
      });
    } else if (comment) {
      if (data.viewType === 'DAILY') {
        RootNavigation.navigate('DailyDetailScreen', {
          ids: {
            groupId: data.groupId,
            dailyId: data.viewId,
            setCommentCount,
            fromProfile: true,
          },
        });
      } else {
        RootNavigation.navigate('ReviewDetailScreen', {
          ids: {
            groupId: data.groupId,
            reviewId: data.viewId,
            setKeepCount,
            setCommentCount,
            fromProfile: true,
          },
        });
      }
    } else {
      RootNavigation.navigate('ReviewDetailScreen', {
        ids: {
          groupId: data.groupId,
          reviewId: data.reviewId,
          setKeepCount,
          setCommentCount,
          fromProfile: true,
        },
      });
    }
  };

  return (
    <AppTouchable
      style={styles.container}
      onPress={onPress}
      disabled={comment && (data.viewIsDelete || data.status) !== 'CREATED'}
    >
      {data.imageUrl && (
        <AppImage
          source={{
            uri: `${Config.IMAGE_SERVER_URI}/${data?.imageUrl}${image_small}`,
          }}
          style={styles.profile}
        />
      )}
      <View style={styles.infoContainer}>
        {!comment && (
          <AppText
            style={styles.title}
            size={16}
            numberOfLines={comment ? 3 : 2}
          >
            {daily ? data.title : data.placeName}
          </AppText>
        )}

        {comment &&
          (data.viewIsDelete ? (
            <AppText style={styles.title} size={16} color={colors.Color6B6A6A}>
              삭제된 게시글입니다.
            </AppText>
          ) : data.status !== 'CREATED' ? (
            data.status === 'DELETED' ? (
              <AppText
                style={styles.title}
                size={16}
                color={colors.Color6B6A6A}
              >
                삭제된 댓글입니다.
              </AppText>
            ) : (
              <AppText
                style={styles.title}
                size={16}
                color={colors.Color6B6A6A}
              >
                신고에의해 블라인드 숨김 처리된 글입니다.
              </AppText>
            )
          ) : (
            <AppText size={16} numberOfLines={3}>
              {data.comment}
            </AppText>
          ))}

        <AppText style={styles.date} size={12} color={colors.Color6B6A6A}>
          {data.groupName}
        </AppText>
        <View style={styles.commentContainer}>
          <AppText size={12} color={colors.Color6B6A6A}>
            {comment && data.title + '   '}
            {data.createDt?.substring(0, 10).replaceAll('-', '.')}
          </AppText>
          {!comment && (
            <View style={[globalStyle.flexRow, { alignItems: 'center' }]}>
              <MyIcon
                style={styles.comment}
                size={toSize(12)}
                name={'ic_message'}
                color={colors.ColorC1C1C1}
              />
              <AppText size={12} color={colors.Color6B6A6A}>
                {commentCountShow}
              </AppText>

              {!daily && (
                <>
                  <MyIcon
                    style={{ marginHorizontal: toSize(4) }}
                    size={toSize(12)}
                    name={'bookmark_on'}
                    color={colors.ColorC1C1C1}
                  />
                  <AppText size={12} color={colors.Color6B6A6A}>
                    {keepCount}
                  </AppText>
                </>
              )}
            </View>
          )}
        </View>
      </View>
    </AppTouchable>
  );
};

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: toSize(8),
    marginHorizontal: toSize(16),
    borderBottomWidth: 1,
    borderColor: colors.ColorE5E5E5,
    alignItems: 'center',
  },
  profile: {
    width: toSize(67),
    height: toSize(71),
    borderRadius: 6,
    // marginTop: toSize(8),
    marginRight: toSize(8),
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
  },
  date: {
    marginVertical: toSize(4),
  },
  comment: {
    marginRight: toSize(4),
  },
  commentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
  },
});

export default ProfileWrittenCard;
