import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FlatList, ActionSheetIOS, View, Alert } from 'react-native';
import AppHeader from 'component/common/appHeader';
import Screen from '../../Screen';
import MyIcon from 'config/icon-font';
import { toSize } from 'config/globalStyle';
import { styles } from './style';
import ReviewDetailKeyboard from 'component/review/detailScreen/reviewDetailKeyboard/index.js';
import MainContent from 'component/review/detailScreen/mainContent';
import Config from 'react-native-config';
import Comment from 'component/review/detailScreen/Comment';
import store from '../../../store';
import { useDispatch, useSelector } from 'react-redux';
import { setSubmitButtonState } from 'store/feature/reviewSlice';
import {
  resetCommentData,
  setCommentList,
  setCommentScrollIndex,
  setEditComment,
  setLoginMemberName,
  setNestedComment,
  setNewComment,
  setRemoveCommentTargetIndex,
} from '../../../store/feature/reviewSlice';
import { callApi } from '../../../function/auth';
import {
  getReviewDetail,
  postReviewComment,
  patchReviewComment,
  deleteReview,
  postReviewKeep,
} from '../../../api/review';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '@gorhom/bottom-sheet';
import RootNavigation from '../../../RootNavigation';
import Svg from '../../../asset/svg';
import { setIds } from '../../../store/feature/userSlice';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AppText from '../../../component/common/appText';
import { colors } from '../../../config/globalStyle';
import updateSameText from '../../../function/updateSameText';
import { image_medium, image_original } from '../../../constants/imageSize';
import AppTouchable from '../../../component/common/appTouchable';
import AppModal from '../../../component/common/appModal';
import { postReport } from '../../../api/group';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ReviewDetailScreen = ({ route: { params }, navigation }) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const ids = useSelector((state) => state.user.ids);
  const authInfo = useSelector((state) => state.user.authInfo);
  const [data, setData] = useState();
  const groupId = data?.reviewsDetail?.groupId;
  const reviewId = data?.reviewsDetail?.reviewId;
  const [isMyPost, setIsMyPost] = useState(false);
  const [isMyKeep, setIsMyKeep] = useState();
  const [isRefresh, setIsRefresh] = useState(false);
  const [keepCountChange, setKeepCountChange] = useState(0);
  const [isApiLoading, setIsApiLoading] = useState(false);
  const commentData = useSelector((state) => state.review.commentList);
  const [toastText, setToastText] = useState('');
  const [exitModalVisible, setExitModalVisible] = useState(false);
  const selectedCommentId = useSelector(
    (state) => state.review.selectedCommentId,
  );
  const navigationDetect = useNavigation();

  // 네비게이션 이동 감지
  useEffect(() => {
    const navEvent = navigationDetect.addListener('beforeRemove', (e) => {
      if (params.fromScreen === 'AlarmMainScreen') {
        return;
      }
      if (
        e.data.action.type === 'NAVIGATE' ||
        (!params.ids.fromHome &&
          !params.ids.fromProfile &&
          !params.ids.fromKeep &&
          !params.ids.fromInfo &&
          !params.ids.fromUser)
      ) {
        return;
      }
      e.preventDefault();
      if (params.ids.fromHome && groupId) {
        RootNavigation.navigate('GroupHomeScreen', {
          groupId,
          isRefresh,
        });
      } else if (params.ids.fromProfile) {
        RootNavigation.navigate('ProfileWrittenScreen', {
          isRefresh,
        });
      } else if (params.ids.fromKeep) {
        RootNavigation.navigate('ProfileKeepScreen', {
          isRefresh,
        });
      } else if (params.ids.fromInfo && groupId) {
        RootNavigation.navigate('GroupInfoScreen', {
          groupId,
          isRefresh,
        });
      } else if (params.ids.fromUser && groupId) {
        RootNavigation.navigate('GroupUserScreen', {
          groupId,
          mid: data?.reviewsDetail.memberMid,
          profileUrl: data?.reviewsDetail.memberProfileUrl,
          isRefresh,
        });
      }
    });
    return navigationDetect.removeListener(navEvent);
  }, [
    navigationDetect,
    isRefresh,
    data,
    params.fromScreen,
    params.ids,
    groupId,
  ]);

  useEffect(() => {
    if (params?.fromScreen === 'AlarmMainScreen') {
      console.log('params?.alarmData:: ', params?.alarmData);
      if (params?.alarmData?.commentId && commentData) {
        dispatch(
          setCommentScrollIndex({
            // 댓글과 대댓글 구분을 위해 parentCommentId를 받는다.
            commentList: commentData,
            commentData: {
              commentId: params.alarmData?.commentId,
            },
          }),
        );
      }
      dispatch(
        setIds({
          groupId,
          reviewId,
          groupName: data?.reviewsDetail?.groupName,
        }),
      );
    } else {
      dispatch(
        setIds({
          groupId,
          reviewId,
          groupName: data?.reviewsDetail?.groupName,
        }),
      );
    }
  }, [
    commentData,
    data?.reviewsDetail?.groupName,
    dispatch,
    groupId,
    reviewId,
    params,
  ]);

  // 댓글 개수 업데이트 시 리덕스 값 또한 업데이트
  useEffect(() => {
    if (data && data !== 819) {
      // if (params?.ids?.setCommentCount) {
      //   params?.ids?.setCommentCount(commentLength);
      // }
    }
  }, [params.ids, data]);

  const getData = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      setData(res.data.data);
      setIsMyPost(res.data.data.reviewsDetail.memberMid === authInfo?.MID);
      if (params?.ids?.setCommentCount) {
        params?.ids?.setCommentCount(res.data.data.reviewsDetail.commentCount);
      }
    } else if (res.data.apiStatus.apiCode === 819) {
      setData(819);
    }
    setIsMyKeep(res.data.data.reviewsDetail.isKeep);
  };

  useEffect(() => {
    setToastText((text) => updateSameText(params?.ids?.toastText, text));
  }, [params]);

  useFocusEffect(
    useCallback(() => {
      if (!params) {
        return;
      }
      if (params?.ids?.isRefresh || params?.isRefresh) {
        console.log('params.ids.isRefresh:: ', params.ids.isRefresh);
        setIsRefresh(params.ids.isRefresh);
      }
      if (params?.fromScreen === 'AlarmMainScreen') {
        callApi(
          getReviewDetail,
          {
            groupId: params.alarmData?.groupId,
            reviewId: params.alarmData?.reviewId,
          },
          getData,
        );
      } else {
        callApi(getReviewDetail, params.ids, getData);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params]),
  );

  const submitMyKeep = (res) => {
    setIsApiLoading(false);
    setToastText((text) =>
      updateSameText(
        `킵 목록에${isMyKeep ? '서 삭제' : ' 추가'} 되었어요!`,
        text,
      ),
    );
  };

  const handleMyKeep = () => {
    setIsApiLoading(true);
    if (isMyKeep) {
      setKeepCountChange((state) => state - 1);
      if (params?.ids?.setKeepCount) {
        params?.ids?.setKeepCount((state) => state - 1);
      }
    } else {
      setKeepCountChange((state) => state + 1);
      if (params?.ids?.setKeepCount) {
        params?.ids?.setKeepCount((state) => state + 1);
      }
    }
    if (params.ids?.setIsKeep) {
      params?.ids?.setIsKeep((state) => !state);
    }
    setIsMyKeep((state) => !state);
    callApi(postReviewKeep, ids, submitMyKeep);
  };

  const [form, setForm] = useState({
    comment: '',
    image: '',
  });

  const keyboardInputRef = useRef();
  const flatListRef = useRef();
  const selectedCommentData = useSelector(
    (state) => state.review.selectedCommentData,
  );

  const SubmitButtonState = useSelector((state) => state.review.submitButton);
  const commentTargetIndex = useSelector(
    (state) => state.review.commentTargetIndex,
  );

  const index = useSelector((state) => state.review.commentTargetIndex);
  const scrollIndex = useSelector((state) => state.review.commentScrollIndex);

  const submitState = useSelector((state) => state.review.submitButton);
  let idx = 0;
  if (index !== undefined) {
    idx = typeof index === 'number' ? index : index[0];
  }
  let scrollIdx = 0;
  if (scrollIndex !== undefined) {
    scrollIdx = typeof scrollIndex === 'number' ? scrollIndex : scrollIndex[0];
  }

  useEffect(() => {
    dispatch(setLoginMemberName(data?.loginMemberName));
    dispatch(setCommentList(data?.comments));
  }, [dispatch, data, flatListRef]);

  const [alarmScrollEnd, setAlarmScrollEnd] = useState(0);
  useEffect(() => {
    const scroll = () => {
      try {
        if (
          alarmScrollEnd < 300 &&
          params.fromScreen === 'AlarmMainScreen' &&
          (scrollIndex >= 0 ||
            (typeof scrollIndex === 'object' && scrollIndex[0] >= 0)) &&
          params?.alarmType !== 'KPS_FCR' &&
          params?.alarmType !== 'KPS_GNR' &&
          submitState === 'submit' &&
          scrollIdx >= 0 &&
          scrollIdx <= commentData?.length
        ) {
          flatListRef?.current?.scrollToIndex({
            index: scrollIdx,
            viewPosition: 0,
          });
          setAlarmScrollEnd(300);
        }
      } catch (e) {
        if (alarmScrollEnd < 300) {
          setAlarmScrollEnd((a) => a + 1);
          setTimeout(() => scroll(), 200);
        }
      }
    };
    setTimeout(() => scroll(), 200);
  }, [
    alarmScrollEnd,
    submitState,
    flatListRef,
    scrollIdx,
    scrollIndex,
    commentData?.length,
    params,
  ]);

  // useEffect(() => {
  //   const scroll = () => {
  //     if (params?.alarmData?.commentId) {
  //       flatListRef?.current?.scrollToIndex({ index, viewPosition: 1 });
  //     }
  //   };
  //   setTimeout(() => scroll(), 1400);
  // }, [params?.alarmData?.commentId, index]);

  const commentSubmit = (res) => {
    setIsApiLoading(false);
    if (res?.data?.data) {
      addNewDummyComment(res.data.data);
    } else if (selectedCommentId) {
      addNewDummyComment(selectedCommentId);
    }
    // 리뷰 등록/수정에 따라 결과를 핸들링하기
    console.log('commentSubmitData:: ', res.data);
    if (
      res.data.apiStatus.apiCode === 200 ||
      res.data.apiStatus.apiCode === 201
    ) {
      setToastText((toast) =>
        updateSameText(
          `댓글이 ${SubmitButtonState === 'submit' ? '등록' : '수정'}되었어요.`,
          toast,
        ),
      );
    }
    dispatch(setRemoveCommentTargetIndex());
    dispatch(resetCommentData());
    callApi(getReviewDetail, params.ids, getData);
  };

  const addNewDummyComment = (commentId) => {
    const newDefaultDummyComment = {
      commentId,
      memberName: data?.loginMemberName,
      memberId: store?.getState()?.user?.authInfo?.MID,
      memberProfileUrl: data?.loginMemberProfileUrl,
      comment: form.comment,
      createDt: '방금 전',
      imageUrl: form.image,
      childComments: [],
      targetName: data?.comments?.targetName,
      targetMid: data?.comments?.targetMid,
      status: 'CREATED',
    };
    if (commentTargetIndex === undefined) {
      if (commentData?.length > 0) {
        flatListRef?.current?.scrollToIndex({
          index: commentData.length - 1,
          viewPosition: 1,
          viewOffset: toSize(-84),
        });
      } else {
        flatListRef?.current?.scrollToOffset({ offset: 99929 });
      }
      dispatch(setNewComment(newDefaultDummyComment));
    } else if (SubmitButtonState === 'edit') {
      dispatch(setEditComment(form));
    } else if (SubmitButtonState === 'submit') {
      flatListRef?.current?.scrollToIndex({
        index: idx,
        viewPosition: 1,
        viewOffset: toSize(-84),
      });

      dispatch(setNestedComment(newDefaultDummyComment));
    }
  };

  const formSubmit = () => {
    setIsApiLoading(true);
    let apiData;
    const ids = params?.ids
      ? params.ids
      : {
          groupId,
          reviewId,
        };
    if (SubmitButtonState === 'submit') {
      apiData = Object.assign(ids, {
        commentData: Object.assign(form, selectedCommentData),
      });
      callApi(postReviewComment, apiData, commentSubmit);
    } else if (SubmitButtonState === 'edit') {
      const commentId = selectedCommentData?.commentId;
      const selectedCommentDataCopy = { ...selectedCommentData };
      delete selectedCommentDataCopy.commentId;
      apiData = Object.assign(
        ids,
        {
          commentData: Object.assign(form, selectedCommentDataCopy),
        },
        { commentId },
      );
      callApi(patchReviewComment, apiData, commentSubmit);
    }
    setForm({
      comment: '',
      image: '',
    });
    dispatch(setSubmitButtonState('submit'));
  };

  const [images, setImages] = useState([]);
  const [modalImages, setModalImages] = useState([]);
  const handleDeleteReivew = (res) => {
    if (
      res.data.apiStatus.apiCode === 200 ||
      res.data.apiStatus.apiCode === 201
    ) {
      if (params?.ids?.fromProfile) {
        RootNavigation.navigate('ProfileWrittenScreen', {
          isRefresh: true,
          toastText: '리뷰가 삭제되었어요.',
        });
      } else if (params?.fromScreen === 'AlarmMainScreen') {
        RootNavigation.goBack();
      } else {
        RootNavigation.navigate('GroupHomeScreen', {
          groupId,
          isRefresh: true,
          toastText: '리뷰가 삭제되었어요.',
        });
        // 리뷰 삭제 토스트
      }
    }
  };
  const headerOptionClick = () => {
    if (isMyPost) {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['닫기', '수정하기', '삭제하기'],
          cancelButtonIndex: 0,
          destructiveButtonIndex: 2,
          userInterfaceStyle: 'light',
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
          } else if (buttonIndex === 1) {
            if (params?.alarmData) {
              RootNavigation.navigate('ReviewPostScreen', {
                groupId,
                reviewId,
                groupName: data?.reviewsDetail?.groupName,
                reviewData: data.reviewsDetail,
                reviewImages: images,
                placeId: data?.reviewsDetail?.placeId,
                fromScreen: 'ReviewDetailScreen',
                nowPage: 'review_edit',
              });
            } else if (params?.ids) {
              RootNavigation.navigate('ReviewPostScreen', {
                nowPage: 'review_edit',
                groupId,
                reviewId,
                groupName: data?.reviewsDetail?.groupName,
                reviewData: data.reviewsDetail,
                reviewImages: images,
                placeId: data?.reviewsDetail?.placeId,
                fromScreen:
                  params?.fromScreen === 'MapScreen' ? 'MapScreen' : undefined,
                fromDetailScreen: params.ids.fromHome
                  ? 'Home'
                  : params.ids.fromKeep
                  ? 'Keep'
                  : params.ids.fromProfile
                  ? 'Profile'
                  : params.ids.fromInfo
                  ? 'Info'
                  : params.ids.fromUser
                  ? 'User'
                  : null,
              });
            }
          } else if (buttonIndex === 2) {
            // 리뷰 삭제 API
            setExitModalVisible(true);
            // callApi(deleteReview, params.ids, handleDeleteReivew);
          }
        },
      );
    } else {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['닫기', '신고하기'],
          cancelButtonIndex: 0,
          destructiveButtonIndex: 1,
          userInterfaceStyle: 'light',
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
          } else if (buttonIndex === 1) {
            // 신고 API 생성되면 작성하기
            callApi(
              postReport,
              {
                reportType: 'REVIEW',
                typeId: reviewId,
              },
              reportSuccess,
            );
          }
        },
      );
    }
  };
  const reportSuccess = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      setToastText((toast) =>
        updateSameText('해당 리뷰글이 신고되었어요.', toast),
      );
    }
  };

  useEffect(() => {
    if (data?.reviewsDetail?.reviewImagesUrl.length) {
      const imagesDATA = (imageSize) =>
        data?.reviewsDetail?.reviewImagesUrl.map((url) => {
          if (url === '') {
            return;
          }
          return {
            url: `${Config.IMAGE_SERVER_URI}/${url}${
              imageSize === 'medium' ? image_medium : image_original
            }`,
            width: WINDOW_WIDTH,
            height: (WINDOW_WIDTH * 229) / 343,
          };
        });
      setImages(imagesDATA('medium'));
      setModalImages(imagesDATA('original'));
    }
  }, [data?.reviewsDetail?.reviewImagesUrl]);

  return (
    <Screen toastText={toastText}>
      {data === 819 ? (
        <>
          <AppHeader
            title={'리뷰'}
            leftIcon={Svg('back_thin')}
            leftIconPress={() => {
              // dispatch(setCommentList([]));
              navigation.goBack();
            }}
            titleType="center"
            style={styles.headerStyle}
            rightIcon={Svg('etc_gray')}
            rightSecondIcon={Svg('keep_outline_gray')}
          />
          <View
            style={[
              styles.deleteContainer,
              { height: WINDOW_HEIGHT - toSize(110) - insets.top },
            ]}
          >
            {Svg('exclamation_mark')}
            <AppText
              style={styles.deleteText}
              color={colors.Color6B6A6A}
              size={16}
            >
              본 게시글이 삭제되었어요
            </AppText>
          </View>
        </>
      ) : (
        <>
          <AppHeader
            title={'리뷰'}
            leftIcon={Svg('back_thin')}
            leftIconPress={() => {
              dispatch(setCommentList([]));
              navigation.goBack();
            }}
            titleType="center"
            style={styles.headerStyle}
            rightIcon={<MyIcon name="ic_etc" size={toSize(24)} />}
            rightSecondIcon={
              isMyKeep
                ? Svg('keep_on')
                : params?.ids?.isDelete
                ? Svg('keep_off_delete')
                : Svg('keep_off')
            }
            rightIconPress={() => headerOptionClick()}
            rightSecondIconPress={
              params?.ids?.isDelete && !isMyKeep
                ? false
                : () => {
                    if (isApiLoading) {
                      return;
                    }
                    handleMyKeep();
                  }
            }
          />

          <FlatList
            ref={flatListRef}
            enableResetScrollToCoords={false}
            keyboardShouldPersistTaps={'handled'}
            keyExtractor={(item) => item.commentId}
            data={commentData}
            initialNumToRender={999}
            // initialScrollIndex={idx}
            // onScrollToIndexFailed={(info) => {
            //   const wait = new Promise((resolve) => setTimeout(resolve, 500));
            //   wait.then(() => {
            //     flatListRef.current?.scrollToIndex({
            //       index: info?.index,
            //       animated: true,
            //     });
            //   });
            // }}
            ListEmptyComponent={
              <View style={styles.emptyComponentView}>
                <AppText
                  color={colors.Color6B6A6A}
                  style={{ marginBottom: toSize(2) }}
                >
                  댓글이 없어요.
                </AppText>
                <AppText color={colors.Color6B6A6A}>
                  첫번째 댓글을 남겨주세요.
                </AppText>
              </View>
            }
            ListHeaderComponent={
              <MainContent
                style={styles.mainContent}
                groupId={groupId}
                reviewsDetail={data?.reviewsDetail}
                images={images}
                modalImages={modalImages}
                keepCountChange={keepCountChange}
                isImage={params?.isImage ? params.isImage : false}
              />
            }
            renderItem={({ item }) => {
              if (!data) {
                return (
                  <>
                    <Comment isData={false} />
                    <Comment isData={false} />
                    <Comment isData={false} />
                    <Comment isData={false} />
                    <Comment isData={false} />
                  </>
                );
              } else {
                return (
                  <Comment
                    commentData={item}
                    initialScrollIndex={idx}
                    keyboardInputRef={keyboardInputRef}
                    loginMemberProfileUrl={data?.loginMemberProfileUrl}
                    setForm={setForm}
                    params={params}
                    groupId={groupId}
                    type="review"
                    setToastText={setToastText}
                    groupIsDelete={data?.reviewsDetail?.groupIsDelete}
                  />
                );
              }
            }}
            ListFooterComponent={
              <View style={styles.commentFooterView}>
                {data?.reviewsDetail?.groupIsDelete ? (
                  <View
                    style={[
                      styles.commentFooterButton,
                      { backgroundColor: colors.ColorE5E5E5 },
                    ]}
                  >
                    <AppText color={colors.ColorC4C4C4}>댓글 달기</AppText>
                  </View>
                ) : (
                  <AppTouchable
                    style={styles.commentFooterButton}
                    onPress={() => keyboardInputRef.current.focus()}
                  >
                    <AppText color={colors.primary}>댓글 달기</AppText>
                  </AppTouchable>
                )}
              </View>
            }
          />
          <ReviewDetailKeyboard
            form={form}
            setForm={setForm}
            formSubmit={formSubmit}
            keyboardInputRef={keyboardInputRef}
            isCommentSubmitLoading={isApiLoading}
            groupIsDelete={data?.reviewsDetail?.groupIsDelete}
          />
        </>
      )}
      <AppModal
        leftButtonText={'취소'}
        rightButtonText={'삭제하기'}
        title={'게시글을 삭제하시겠어요?'}
        visible={exitModalVisible}
        onPressLeft={() => setExitModalVisible(false)}
        onPressRight={() => {
          setExitModalVisible(false);
          if (params?.ids) {
            callApi(deleteReview, params.ids, handleDeleteReivew);
          } else if (params?.alarmData) {
            callApi(
              deleteReview,
              {
                groupId,
                reviewId,
              },
              handleDeleteReivew,
            );
          }
        }}
      />
    </Screen>
  );
};

export default ReviewDetailScreen;
