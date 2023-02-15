import { isEmpty } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActionSheetIOS,
  Animated,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import GroupReviewCard from '../reviewCard';
import { deleteReview } from '../../../api/review';
import AppLoading from '../../common/appLoading';
import { colors, screenWidth, toSize } from '../../../config/globalStyle';
import { callApi } from '../../../function/auth';
import {
  getGroupsDaily,
  getGroupsReview,
  postReport,
} from '../../../api/group';
import AppText from '../../common/appText';
import jwt_decode from 'jwt-decode';
import GroupDailyCard from '../dailyCard';
import { useDispatch, useSelector } from 'react-redux';
import RootNavigation from '../../../RootNavigation';
import { useFocusEffect } from '@react-navigation/native';
import Config from 'react-native-config';
import AppModal from '../../common/appModal';
import { setIds } from '../../../store/feature/userSlice';
import updateSameText from '../../../function/updateSameText';
import Svg from '../../../asset/svg';
import MyIcon from '../../../config/icon-font';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GroupMainList = ({
  data,
  isDelete,
  scrollY,
  visible,
  type,
  isRefresh,
  fromHome,
  fromUser,
  fromDetail,
  setToastText,
  setDoRefresh,
  groupId,
  tabData,
  reviewCount,
  dailyCount,
  setReviewCount,
  setDailyCount,
  collapsibleHeaderHeight,
  targetId,
}) => {
  const [refresh, setRefresh] = useState(false);
  const [reviewData, setReviewData] = useState(null);
  const [dailyData, setDailyData] = useState(null);
  const [lastReviewId, setlastReviewId] = useState(null);
  const [lastDailyId, setlastDailyId] = useState(null);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [groupDeleteVisible, setGroupDeleteVisible] = useState(false);
  const [reviewId, setReviewId] = useState(false);

  const MID = useSelector((state) => state.user.authInfo?.MID);
  const tabHeight = toSize(57);
  const dispatch = useDispatch();
  const ids = useSelector((state) => state.user.ids);
  const ListRef = useRef();

  useFocusEffect(
    useCallback(() => {
      if (type === '리뷰' && !reviewData) {
        const params = [
          groupId,
          {
            pageSize: 10,
            targetMid: targetId ? targetId : undefined,
          },
        ];
        callApi(getGroupsReview, params, handleReview);
      } else if (type === '일상' && !dailyData) {
        const params = [
          groupId,
          {
            pageSize: 10,
            targetMid: targetId ? targetId : undefined,
          },
        ];
        callApi(getGroupsDaily, params, handleDaily);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type, reviewData, dailyData]),
  );

  useEffect(() => {
    if (
      (type === '리뷰' && reviewData && tabData[0].active) ||
      (type === '일상' && dailyData && tabData[1].active)
    ) {
      onRefresh(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabData[0].active, tabData[1].active]);

  useEffect(() => {
    if (data && isDelete && type === '리뷰') {
      try {
        AsyncStorage.getItem('groupDelete' + MID + groupId).then((req) => {
          console.log('groupDelete' + MID + groupId);
          if (!req) {
            setGroupDeleteVisible(true);
          } else {
            setGroupDeleteVisible(false);
          }
        });
      } catch (error) {
        setGroupDeleteVisible(true);
        console.log('error getting groupDelete list', error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, groupId]);

  useFocusEffect(
    useCallback(() => {
      if (isRefresh) {
        onRefresh(true);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isRefresh]),
  );

  const onRefresh = (skeleton = false) => {
    if (type === '리뷰') {
      if (skeleton) {
        if (ListRef) {
          ListRef.current?.scrollToOffset({ animated: true, offset: 0 });
        }
        setReviewData(null);
      }
      const params = [
        groupId,
        { pageSize: 10, targetMid: targetId ? targetId : undefined },
      ];
      callApi(getGroupsReview, params, handleReview);
    } else if (type === '일상') {
      if (skeleton) {
        if (ListRef) {
          ListRef.current?.scrollToOffset({ animated: true, offset: 0 });
        }
        setDailyData(null);
      }
      const params = [
        groupId,
        { pageSize: 10, targetMid: targetId ? targetId : undefined },
      ];
      callApi(getGroupsDaily, params, handleDaily);
    }
  };

  const handleDeleteReivew = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      setToastText((text) => updateSameText('리뷰글이 삭제되었어요.', text));
      onRefresh(true);
    }
  };

  const handleImage = (item) => {
    var temp = [];
    if (item) {
      for (const url of item?.review.images) {
        if (url) {
          temp.push({
            url: `${Config.IMAGE_SERVER_URI}/${url}`,
            width: screenWidth,
            height: (screenWidth * 229) / 343,
          });
        }
      }
    }
    return temp;
  };

  const handleReview = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      setReviewCount(res.data.data.reviewCount);
      setReviewData(res.data.data.reviewData);
      setlastReviewId(res.data.data.lastReviewSeq);
      if (setDoRefresh) {
        setDoRefresh(false);
      }
    }
  };

  const handleReviewEnd = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      const temp = [...reviewData, ...res.data.data.reviewData];
      setReviewCount(res.data.data.reviewCount);
      setReviewData(temp);
      setlastReviewId(res.data.data.lastReviewSeq);
    }
  };

  const handleDaily = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      setDailyCount(res.data.data.dailyCount);
      setDailyData(res.data.data.dailyData);
      setlastDailyId(res.data.data.lastDailySeq);
      if (setDoRefresh) {
        setDoRefresh(false);
      }
    }
  };

  const handleDailyEnd = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      const temp = [...dailyData, ...res.data.data.dailyData];
      setDailyCount(res.data.data.dailyCount);
      setDailyData(temp);
      setlastDailyId(res.data.data.lastDailySeq);
    }
  };

  const options = ['닫기', '신고하기'];
  const tabEtcPress = (id) =>
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: options,
        cancelButtonIndex: 0,
        destructiveButtonIndex: 1,
        userInterfaceStyle: 'light',
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          console.log('cancel');
        } else if (buttonIndex === 1) {
          callApi(
            postReport,
            {
              reportType: 'REVIEW',
              typeId: id,
            },
            handleReport,
          );
        }
      },
    );

  const handleReport = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      setToastText((text) =>
        updateSameText('해당 리뷰글이 신고되었어요.', text),
      );
    }
  };

  const optionsOwner = ['닫기', '수정하기', '삭제하기'];
  const optionsOwnerDelete = ['닫기', '삭제하기'];
  const tabEtcPressOwner = (targetReview) => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: isDelete ? optionsOwnerDelete : optionsOwner,
        cancelButtonIndex: 0,
        destructiveButtonIndex: isDelete ? 1 : 2,
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          console.log('cancel');
        } else if (buttonIndex === 1) {
          if (isDelete) {
            setReviewId(targetReview.review.reviewId);
            setDeleteVisible(true);
          } else {
            dispatch(
              setIds({ reviewId: targetReview.review.reviewId, ...ids }),
            );
            RootNavigation.navigate('ReviewDetailScreen', {
              ids: {
                groupId,
                reviewId: targetReview.review.reviewId,
                fromHome,
                fromUser,
              },
            });
            RootNavigation.navigate('ReviewPostScreen', {
              nowPage: 'review_edit',
              reviewData: {
                placeId: targetReview.place.placeId,
                placeName: targetReview.place.placeName,
                placeAddress: targetReview.place.roadAddress,
                reviewImagesUrl: targetReview?.review?.images,
                reviewContent: targetReview.review.content,
              },
              fromDetailScreen: fromHome ? 'Home' : fromUser ? 'User' : null,
            });
          }
        } else if (buttonIndex === 2) {
          setReviewId(targetReview.review.reviewId);
          setDeleteVisible(true);
        }
      },
    );
  };

  const Card = type === '리뷰' ? GroupReviewCard : GroupDailyCard;

  const tempData = [null, null, null, null, null, null];

  return visible ? (
    <>
      {(
        type === '리뷰'
          ? isEmpty(reviewData) && reviewData?.length !== 0
          : isEmpty(dailyData) && dailyData?.length !== 0
      ) ? (
        <Animated.FlatList
          ref={ListRef}
          contentContainerStyle={{
            marginTop: collapsibleHeaderHeight + tabHeight,
            paddingTop: type === '일상' && toSize(7),
            paddingBottom: toSize(150),
          }}
          // scrollEnabled={false}
          data={tempData}
          keyExtractor={(item, index) => `TempList_${index}`}
          renderItem={({ item, index }) => (
            <Card
              fromHome={fromHome}
              fromUser={fromUser}
              userId={targetId}
              groupId={groupId}
              image={type === '리뷰' ? handleImage(item) : null}
            />
          )}
        />
      ) : (
        <Animated.FlatList
          ref={ListRef}
          contentContainerStyle={{
            marginTop: collapsibleHeaderHeight + tabHeight,
            paddingTop: type === '일상' && !isDelete && toSize(7),
            paddingBottom: toSize(150),
          }}
          ListHeaderComponent={
            isDelete &&
            !fromUser && (
              <View style={styles.deleteContainer}>
                {Svg('ic_warning')}
                <AppText style={{ marginLeft: toSize(12) }} weight={'medium'}>
                  {`${data?.deleteDt.substring(
                    data?.deleteDt[5] === '0' ? 6 : 5,
                    7,
                  )}월 ${data?.deleteDt.substring(8, 10)}일 그룹 삭제 예정`}
                </AppText>
              </View>
            )
          }
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          // contentOffset={{ x: 0, y: scrollY._value }}
          ListEmptyComponent={
            <View style={styles.empty}>
              <AppText
                size={16}
                color={colors.Color6B6A6A}
                style={styles.emptyText}
              >
                {fromHome
                  ? type === '리뷰'
                    ? '아직 작성된 리뷰가 없어요\n 아래 아이콘을 눌러 첫 리뷰를 작성해보세요.'
                    : '아직 작성된 일상글이 없어요\n 아래 아이콘을 눌러 첫 일상글을 작성해보세요.'
                  : type === '리뷰'
                  ? '아직 작성된 리뷰가 없어요\n 첫 리뷰를 작성해보세요!'
                  : '아직 작성된 일상글이 없어요\n 첫 일상글을 작성해보세요!'}
              </AppText>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={refresh}
              onRefresh={onRefresh}
              progressViewOffset={collapsibleHeaderHeight + tabHeight}
            />
          }
          data={type === '리뷰' ? reviewData : dailyData}
          extraData={type === '리뷰' ? reviewData : dailyData}
          keyExtractor={(item, index) => `GroupMainList_${index}`}
          renderItem={({ item, index }) => (
            <Card
              data={item}
              setToastText={setToastText}
              fromHome={fromHome}
              fromUser={fromUser}
              fromDetail={fromDetail}
              userId={targetId}
              groupId={groupId}
              isDelete={isDelete}
              image={type === '리뷰' ? handleImage(item) : null}
              onPressEtc={
                MID !== item.member?.mid
                  ? () => tabEtcPress(item.review.reviewId)
                  : () => tabEtcPressOwner(item)
              }
            />
          )}
          scrollEventThrottle={4}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            {
              useNativeDriver: true,
            },
          )}
          onEndReachedThreshold={0}
          onEndReached={({ distanceFromEnd }) => {
            if (distanceFromEnd) {
              // 데이터 받아오기
              if (type === '리뷰') {
                if (reviewData.length < reviewCount) {
                  const params = [
                    groupId,
                    {
                      pageSize: 10,
                      lastReviewSeq: lastReviewId,
                      targetMid: targetId ? targetId : undefined,
                    },
                  ];
                  callApi(getGroupsReview, params, handleReviewEnd);
                }
              } else if (type === '일상') {
                if (dailyData.length < dailyCount) {
                  const params = [
                    groupId,
                    {
                      pageSize: 10,
                      lastDailySeq: lastDailyId,
                      targetMid: targetId ? targetId : undefined,
                    },
                  ];
                  callApi(getGroupsDaily, params, handleDailyEnd);
                }
              }
            }
          }}
        />
      )}
      <AppModal
        visible={deleteVisible}
        title={'게시글을 삭제하시겠어요?'}
        leftButtonText={'취소'}
        onPressLeft={() => setDeleteVisible(false)}
        rightButtonText={'삭제하기'}
        onPressRight={() => {
          setDeleteVisible(false);
          callApi(
            deleteReview,
            { groupId: groupId, reviewId: reviewId },
            handleDeleteReivew,
          );
        }}
      />

      <AppModal
        visible={groupDeleteVisible}
        icon={
          <MyIcon
            name={'ic_warn'}
            size={toSize(42)}
            style={{ marginBottom: toSize(16) }}
          />
        }
        title={'그룹 삭제 안내'}
        content={`그룹장이 그룹을 삭제했어요.\n이 그룹은 ${data?.deleteDt}에 영구 삭제돼요.\n유지 기간 동안은 작성글과 지도를 보는\n활동만 할 수 있어요.`}
        rightButtonText={'확인'}
        onPressRight={() => {
          try {
            AsyncStorage.setItem('groupDelete' + MID + groupId, 'check').then(
              (req) => {
                setGroupDeleteVisible(false);
              },
            );
          } catch (error) {
            setGroupDeleteVisible(false);
            console.log('error getting groupDelete list', error);
          }
        }}
      />
    </>
  ) : (
    <></>
  );
};

export const styles = StyleSheet.create({
  empty: {
    marginTop: toSize(185),
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    lineHeight: toSize(24),
  },
  deleteContainer: {
    flexDirection: 'row',
    height: toSize(50),
    backgroundColor: colors.ColorFFE9E9,
    alignItems: 'center',
    paddingHorizontal: toSize(16),
  },
});

export default GroupMainList;
