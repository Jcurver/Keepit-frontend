import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActionSheetIOS, FlatList } from 'react-native';
import AppHeader from '../../../component/common/appHeader';
import RootNavigation from '../../../RootNavigation';
import Screen from '../../Screen';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Svg from '../../../asset/svg';
import { View } from 'react-native';
import AppText from '../../../component/common/appText';
import { styles } from './styles';
import { colors } from '../../../config/globalStyle';
import { callApi } from '../../../function/auth';
import { getPlaceReview } from '../../../api/place';
import GroupReviewCard from '../../../component/group/reviewCard';
import { useDispatch, useSelector } from 'react-redux';
import { getGroupsHome, postReport } from '../../../api/group';
import updateSameText from '../../../function/updateSameText';
import AppModal from '../../../component/common/appModal';
import { deleteReview } from '../../../api/review';
import { setIds } from '../../../store/feature/userSlice';
import { setMapRefresh } from '../../../store/feature/groupSlice';

const ReviewListScreen = ({ route: { params } }) => {
  const [toastText, setToastText] = useState();
  const [data, setData] = useState();
  const [lastReviewSeq, setLastReviewSeq] = useState();
  const [isDelete, setIsDelete] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [reviewId, setReviewId] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const MID = useSelector((state) => state.user.authInfo?.MID);
  const dispatch = useDispatch();
  const ids = useSelector((state) => state.user.ids);
  const navigationDetect = useNavigation();

  useEffect(
    () =>
      navigationDetect.addListener('beforeRemove', (e) => {
        dispatch(setMapRefresh(false));
        return;
        // if (e.data.action.type === 'NAVIGATE') {
        // }
        // e.preventDefault();
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [navigationDetect, data],
  );

  // useEffect(() => {
  //   callApi(getGroupsHome, params.groupId, handleGroup);
  //   callApi(
  //     getPlaceReview,
  //     {
  //       groupId: params.groupId,
  //       placeId: params.placeId,
  //       pageSize: 10,
  //       lastReviewSeq: lastReviewSeq ? lastReviewSeq : undefined,
  //     },
  //     handleData,
  //   );
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  useFocusEffect(
    useCallback(() => {
      callApi(getGroupsHome, params.groupId, handleGroup);
      callApi(
        getPlaceReview,
        {
          groupId: params.groupId,
          placeId: params.placeId,
          pageSize: 10,
          lastReviewSeq: lastReviewSeq ? lastReviewSeq : undefined,
        },
        handleData,
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const onRefresh = () => {
    callApi(
      getPlaceReview,
      {
        groupId: params.groupId,
        placeId: params.placeId,
        pageSize: 10,
        lastReviewSeq: lastReviewSeq ? lastReviewSeq : undefined,
      },
      handleData,
    );
  };

  const handleData = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      setData(res.data.data.reviewData);
      setLastReviewSeq(res.data.data.lastReviewSeq);
    }
  };

  const handleGroup = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      setIsDelete(res.data.data.isDelete);
    }
  };

  const handleDeleteReivew = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      setToastText((text) => updateSameText('리뷰글이 삭제되었어요.', text));
      onRefresh();
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
            RootNavigation.push('ReviewDetailScreen', {
              ids: {
                groupId: params.groupId,
                reviewId: targetReview.review.reviewId,
              },
            });
            RootNavigation.navigate('ReviewPostScreen', {
              reviewData: {
                placeId: targetReview.place.placeId,
                placeName: targetReview.place.placeName,
                placeAddress: targetReview.place.roadAddress,
                reviewImagesUrl: targetReview?.review?.images,
                reviewContent: targetReview.review.content,
              },
              fromScreen: 'MapScreen',
              nowPage: 'review_edit',
            });
          }
        } else if (buttonIndex === 2) {
          setReviewId(targetReview.review.reviewId);
          setDeleteVisible(true);
        }
      },
    );
  };

  return (
    <Screen toastText={toastText}>
      <AppHeader
        leftIcon={Svg('back_thin')}
        leftIconPress={() => {
          dispatch(setMapRefresh(false));
          RootNavigation.goBack();
        }}
        title={params?.placeName}
      />

      <FlatList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        refreshing={refresh}
        onRefresh={onRefresh}
        ListEmptyComponent={
          <View style={styles.empty}>
            <AppText
              size={16}
              color={colors.Color6B6A6A}
              style={styles.emptyText}
            >
              {'아직 작성된 리뷰가 없어요'}
            </AppText>
          </View>
        }
        data={data}
        keyExtractor={(item, index) => `PlaceReview_${index}`}
        renderItem={({ item, index }) => (
          <GroupReviewCard
            data={item}
            fromMap
            setToastText={setToastText}
            groupId={params.groupId}
            isDelete={isDelete}
            onPressEtc={
              MID !== item.member?.mid
                ? () => tabEtcPress(item.review.reviewId)
                : () => tabEtcPressOwner(item)
            }
          />
        )}
        scrollEventThrottle={4}
        onEndReachedThreshold={0}
        onEndReached={({ distanceFromEnd }) => {
          if (distanceFromEnd) {
          }
        }}
      />

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
            { groupId: params.groupId, reviewId: reviewId },
            handleDeleteReivew,
          );
        }}
      />
    </Screen>
  );
};

export default ReviewListScreen;
