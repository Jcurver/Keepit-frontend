import { isEmpty } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { postReviewKeep } from '../../../api/review';
import {
  colors,
  globalStyle,
  images,
  screenWidth,
  toSize,
} from '../../../config/globalStyle';
import writtenDate from '../../../function/writtenDate';
import MyIcon from '../../../config/icon-font';
import Svg from '../../../asset/svg';
import AppText from '../../common/appText';
import AppTouchable from '../../common/appTouchable';
import { callApi } from '../../../function/auth';
import RootNavigation from '../../../RootNavigation';
import jwt_decode from 'jwt-decode';
import Carousel from 'react-native-snap-carousel';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import AppImage from '../../common/appImage';
import { image_medium, image_small } from '../../../constants/imageSize';
import Config from 'react-native-config';
import Skeleton from '../../common/skeleton';
import updateSameText from '../../../function/updateSameText';

const GroupReviewCard = ({
  data = undefined,
  isDelete,
  onPressEtc,
  groupId,
  fromHome,
  fromInfo,
  fromUser,
  fromDetail,
  fromMap,
  setToastText,
}) => {
  const numberOfLines = 2;
  const [imageIndex, setImageIndex] = useState(0);
  const [isKeep, setIsKeep] = useState();
  const [keepCount, setKeepCount] = useState();
  const [commentCount, setCommentCount] = useState();
  const [commentCountShow, setCommentCountShow] = useState(0);
  const [reduce, setReduce] = useState(false);
  const [reduceSec, setReduceSec] = useState(false);
  const [content, setContent] = useState();
  const [isApiLoading, setIsApiLoading] = useState(false);
  const isData = data !== undefined;

  useEffect(() => {
    // console.log(screenWidth - toSize(32) - 1.5);
    setIsKeep(data?.review.isKeep);
    setKeepCount(data?.review.keepCount);
    setCommentCount(data?.review.commentCount);
    setContent(data?.review.content.trim('\n'));
  }, [data]);

  useFocusEffect(
    useCallback(() => {
      setCommentCountShow(commentCount);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [commentCount]),
  );

  const onPress = () => {
    if (data) {
      if (fromDetail || fromMap) {
        RootNavigation.push('ReviewDetailScreen', {
          ids: {
            groupId,
            reviewId: data.review.reviewId,
            setIsKeep,
            setKeepCount,
            setCommentCount,
            isDelete,
            fromHome,
            fromInfo,
            fromUser,
          },
          fromScreen: fromMap ? 'MapScreen' : undefined,
          isImage: data?.review?.images[0] !== '' ? true : false,
        });
      } else {
        RootNavigation.navigate('ReviewDetailScreen', {
          ids: {
            groupId,
            reviewId: data.review.reviewId,
            setIsKeep,
            setKeepCount,
            setCommentCount,
            isDelete,
            fromHome,
            fromInfo,
            fromUser,
          },
          isImage: data?.review?.images[0] !== '' ? true : false,
        });
      }
    }
  };

  const handleKeep = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      if (isKeep) {
        setToastText((text) =>
          updateSameText('킵 목록에서 삭제 되었어요.', text),
        );
        setKeepCount((state) => state - 1);
      } else {
        setToastText((text) =>
          updateSameText('킵 목록에 추가 되었어요!', text),
        );
        setKeepCount((state) => state + 1);
      }
      setIsKeep(!isKeep);
      setIsApiLoading(false);
    }
  };

  const onTextLayout = useCallback((e) => {
    if (e.nativeEvent.lines.length > numberOfLines) {
      if (e.nativeEvent.lines[1].width === 0) {
        // 두번째 줄 줄바꿈
        setContent(e.nativeEvent.lines[0].text.trim('\n'));
        setReduce(true);
      } else if (e.nativeEvent.lines[1].width < screenWidth - toSize(32) - 10) {
        // 두번째 줄 다 안채움
        setContent(
          e.nativeEvent.lines[0].text +
            e.nativeEvent.lines[1].text.trim('\n') +
            '...',
        );
        setReduceSec(true);
        // 추가
      } else {
        // 두번째 줄 다채움
        var length = e.nativeEvent.lines[1].text.trim('\n').length;
        setContent(
          e.nativeEvent.lines[0].text +
            e.nativeEvent.lines[1].text.trim('\n').substring(0, length - 3) +
            '...',
        );
        setReduceSec(true);
      }
    }
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppTouchable
          style={styles.profileInfo}
          onPress={() => {
            if (data) {
              if (fromDetail || fromMap) {
                RootNavigation.push('GroupUserScreen', {
                  groupId,
                  mid: data?.member.mid,
                  fromHome,
                  fromInfo,
                });
              } else {
                RootNavigation.navigate('GroupUserScreen', {
                  groupId,
                  mid: data?.member.mid,
                  fromHome,
                  fromInfo,
                });
              }
            }
          }}
        >
          {data?.member.profileUrl ? (
            <AppImage
              source={{
                uri: `${Config.IMAGE_SERVER_URI}/${data?.member.profileUrl}${image_small}`,
              }}
              style={styles.profile}
              icon={'profile_empty'}
              size={toSize(15)}
              color={colors.ColorAEE9D2}
            />
          ) : isData ? (
            <View style={[globalStyle.empty, styles.profile]}>
              <MyIcon
                name={'profile_empty'}
                size={toSize(15)}
                color={colors.ColorAEE9D2}
              />
            </View>
          ) : (
            <Skeleton
              width={32}
              height={32}
              style={{ borderRadius: 999 }}
              noStyle
            />
          )}

          <AppText
            size={12}
            isData={isData}
            sWidth={59}
            sHeight={18}
            viewStyle={{ marginLeft: toSize(8) }}
          >
            {data?.member.name}
          </AppText>
        </AppTouchable>
        {data && (
          <View style={styles.profileInfo}>
            <AppTouchable
              style={[styles.icon, { marginRight: toSize(16) }]}
              disabled={isDelete && !isKeep}
              onPress={() => {
                if (data && !isApiLoading) {
                  setIsApiLoading(true);
                  callApi(
                    postReviewKeep,
                    {
                      groupId,
                      reviewId: data?.review.reviewId,
                    },
                    handleKeep,
                  );
                }
              }}
            >
              {isKeep
                ? Svg('keep_on')
                : isDelete
                ? Svg('keep_off_delete')
                : Svg('keep_off')}
            </AppTouchable>
            <AppTouchable style={styles.icon} onPress={onPressEtc}>
              <MyIcon size={toSize(18)} name={'ic_etc'} />
            </AppTouchable>
          </View>
        )}
      </View>

      <View>
        {isData ? (
          !isEmpty(data?.review.images) &&
          data.review.images[0].length > 1 && (
            <>
              {data?.review.images.length > 1 && (
                <View style={styles.footerBackground}>
                  <AppText size={12}>
                    {imageIndex + 1}/{data.review.images.length}
                  </AppText>
                </View>
              )}
              {data?.review.images.length === 1 ? (
                <AppTouchable onPress={onPress}>
                  <AppImage
                    style={styles.soleImage}
                    source={{
                      uri: `${Config.IMAGE_SERVER_URI}/${data?.review.images[0]}${image_medium}`,
                    }}
                    size={toSize(65)}
                  />
                </AppTouchable>
              ) : (
                <Carousel
                  data={data?.review.images}
                  sliderWidth={screenWidth - 32}
                  itemWidth={screenWidth - 32}
                  firstItem={imageIndex}
                  onSnapToItem={(index) => setImageIndex(index)}
                  inactiveSlideOpacity={1}
                  renderItem={({ item, index }) => {
                    return (
                      <AppTouchable
                        key={`reviewCard_${index}`}
                        opacity={1}
                        onPress={onPress}
                      >
                        <AppImage
                          source={{
                            uri: `${Config.IMAGE_SERVER_URI}/${item}${image_medium}`,
                          }}
                          style={styles.mainImage}
                          size={toSize(65)}
                        />
                      </AppTouchable>
                    );
                  }}
                />
              )}
            </>
          )
        ) : (
          <Skeleton type={'imageDetail'} style={{ borderRadius: 4 }} />
        )}
        <AppTouchable onPress={onPress}>
          <View style={[styles.profileInfo, { marginTop: toSize(6) }]}>
            {isData && Svg('ic_location_color')}
            <AppText
              weight={'bold'}
              style={{ marginLeft: toSize(6) }}
              size={16}
              sWidth={240}
              sHeight={24}
              isData={isData}
              viewStyle={{ paddingVertical: toSize(3) }}
            >
              {data?.place.placeName}
            </AppText>
          </View>
          <AppText
            style={{ marginTop: toSize(4) }}
            color={colors.ColorC4C4C4}
            size={12}
            isData={isData}
            sWidth={91}
            sHeight={16}
            viewStyle={{ paddingVertical: toSize(3) }}
          >
            {data?.place.roadAddress !== ''
              ? data?.place.roadAddress
              : data?.place.address}
          </AppText>

          <View
            style={[
              styles.profileInfo,
              isData && { marginVertical: toSize(6) },
            ]}
          >
            <AppText
              size={12}
              color={colors.Color6B6A6A}
              isData={isData}
              sWidth={145}
              sHeight={16}
              viewStyle={{ paddingVertical: toSize(3) }}
            >
              {writtenDate(data?.review.createDt)}
            </AppText>
            {isData && (
              <>
                <MyIcon
                  style={styles.comment}
                  size={toSize(16)}
                  name={'ic_message'}
                  color={colors.ColorC1C1C1}
                />
                <AppText size={12} color={colors.Color6B6A6A}>
                  {commentCountShow}
                </AppText>
                <MyIcon
                  style={styles.comment}
                  size={toSize(15)}
                  name={'bookmark_on'}
                  color={colors.ColorC1C1C1}
                />
                <AppText size={12} color={colors.Color6B6A6A}>
                  {keepCount}
                </AppText>
              </>
            )}
          </View>
          <AppText
            style={[styles.content, reduce && { marginBottom: 0 }]}
            size={12}
            onTextLayout={onTextLayout}
            ellipsizeMode={'clip'}
            isData={isData}
            sWidth={343}
            sHeight={42}
            viewStyle={{ paddingVertical: toSize(3), marginBottom: toSize(12) }}
          >
            {content}
            {reduceSec && <MyIcon name={'ic_arrow_down'} size={toSize(6)} />}
          </AppText>
          {reduce && (
            <AppText size={12} style={{ marginBottom: toSize(12) }}>
              {'... '}
              {<MyIcon name={'ic_arrow_down'} size={toSize(6)} />}
            </AppText>
          )}
        </AppTouchable>
      </View>
    </View>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: toSize(16),
    borderBottomWidth: 1,
    borderColor: colors.ColorF4F4F4,
  },
  header: {
    marginTop: toSize(12),
    marginBottom: toSize(6),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  profileInfo: {
    // marginTop: toSize(6),
    flexDirection: 'row',
    alignItems: 'center',
  },
  profile: {
    width: toSize(32),
    height: toSize(32),
    borderRadius: 999,
    backgroundColor: colors.ColorF0FFF9,
    marginRight: toSize(5),
  },
  soleImage: {
    width: screenWidth - toSize(32),
    height: ((screenWidth - toSize(32)) * 229) / 343,
  },
  mainImage: {
    width: screenWidth - toSize(32),
    height: ((screenWidth - toSize(32)) * 229) / 343,
  },
  footerBackground: {
    position: 'absolute',
    right: toSize(16),
    top: toSize(16),
    backgroundColor: 'white',
    opacity: 0.42,
    justifyContent: 'center',
    alignItems: 'center',
    width: toSize(32),
    height: toSize(18),
    borderRadius: 999,
    zIndex: 99,
  },
  icon: {
    width: toSize(24),
    height: toSize(24),
    alignItems: 'center',
    justifyContent: 'center',
  },
  comment: {
    marginLeft: toSize(8),
    marginRight: toSize(4),
  },
  content: {
    marginBottom: toSize(12),
    // borderWidth: 1,
    // borderColor: 'red',
    // maxHeight: toSize(40),
  },
});

export default GroupReviewCard;
