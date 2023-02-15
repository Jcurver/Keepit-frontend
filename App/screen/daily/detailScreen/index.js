import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FlatList, ActionSheetIOS, View } from 'react-native';
import AppHeader from 'component/common/appHeader';
import Screen from '../../Screen';
import MyIcon from 'config/icon-font';
import { toSize } from 'config/globalStyle';
import { styles } from './style';
import ReviewDetailKeyboard from 'component/review/detailScreen/reviewDetailKeyboard/index.js';
import { colors } from 'config/globalStyle';
import MainContent from 'component/daily/detailScreen/MainContent/index.js';
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
import {
  postDailyComment,
  patchDailyComment,
  deleteDaily,
  postDailyKeep,
} from 'api/daily';
import { callApi } from '../../../function/auth';
import { getDailyDetail } from 'api/daily';
import RootNavigation from '../../../RootNavigation';
import Svg from '../../../asset/svg';
import { setIds } from '../../../store/feature/userSlice';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AppText from '../../../component/common/appText';
import AppTouchable from '../../../component/common/appTouchable';
import updateSameText from '../../../function/updateSameText';
import AppModal from '../../../component/common/appModal';
import { postReport } from '../../../api/group';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WINDOW_HEIGHT } from '@gorhom/bottom-sheet';

const DailyDetailScreen = ({ route: { params }, navigation }) => {
  const insets = useSafeAreaInsets();
  const [toastText, setToastText] = useState('');
  const [exitModalVisible, setExitModalVisible] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);
  const dispatch = useDispatch();
  const [isApiLoading, setIsApiLoading] = useState(false);
  const selectedCommentId = useSelector(
    (state) => state.review.selectedCommentId,
  );
  const [form, setForm] = useState({
    comment: '',
    image: '',
  });
  const keyboardInputRef = useRef();
  const flatListRef = useRef();
  const commentData = useSelector((state) => state.review.commentList);
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
  const [data, setData] = useState();
  const groupId = data?.dailyDetail?.groupId;
  const dailyId = data?.dailyDetail?.dailyId;
  console.log('groupId,dailyId:: ', groupId, dailyId);

  let idx = 0;
  if (index !== undefined) {
    idx = typeof index === 'number' ? index : index[0];
  }
  let scrollIdx = 0;
  if (scrollIndex !== undefined) {
    scrollIdx = typeof scrollIndex === 'number' ? scrollIndex : scrollIndex[0];
  }

  useEffect(() => {
    if (params?.fromScreen === 'AlarmMainScreen') {
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
    }
    dispatch(setIds({ groupId, dailyId }));
    if (params?.ids?.setCommentCount) {
      params.ids.setCommentCount(commentData?.length);
    }
  }, [dispatch, params, commentData, groupId, dailyId]);

  useEffect(() => {
    setToastText((text) => updateSameText(params.toastText, text));
  }, [setToastText, params.toastText]);

  console.log('data:: ', data);
  const [isMyKeep, setIsMyKeep] = useState();
  const MID = useSelector((state) => state.user.authInfo?.MID);
  const ids = useSelector((state) => state.user.ids);

  const getData = (res) => {
    if (
      res.data.apiStatus.apiCode === 200 ||
      res.data.apiStatus.apiCode === 201
    ) {
      setData(res.data.data);
    } else if (res.data.apiStatus.apiCode === 822) {
      setData(822);
    }
    console.log('res.data.data.dailyDetail:: ', res.data);

    setIsMyKeep(res.data.data.dailyDetail.isKeep);
  };

  useEffect(() => {
    console.log('11111111111111111111111111111');
    if (!params) {
      return;
    }
    console.log('222');

    if (params?.fromScreen === 'AlarmMainScreen') {
      callApi(
        getDailyDetail,
        {
          groupId: params.alarmData?.groupId,
          dailyId: params.alarmData?.dailyId,
        },
        getData,
      );
    } else {
      callApi(getDailyDetail, params.ids, getData);
    }
  }, [params]);

  const submitMyKeep = (res) => {
    setIsApiLoading(false);
    console.log('res.data.apiStatus.apiCode:: ', res.data.apiStatus.apiCode);
    if (res.data.apiStatus.apiCode === 200) {
      setToastText((text) =>
        updateSameText(
          `킵 목록에${isMyKeep ? '서 삭제' : ' 추가'} 되었어요!`,
          text,
        ),
      );
    }
  };

  const navigationDetect = useNavigation();

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
    console.log('newDefaultDummyComment:: ', newDefaultDummyComment);
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
      console.log('submit idx', idx);
      flatListRef?.current?.scrollToIndex({
        index: idx,
        viewPosition: 1,
        viewOffset: toSize(-84),
      });

      dispatch(setNestedComment(newDefaultDummyComment));
    }
  };

  const commentSubmit = (res) => {
    if (res?.data?.data) {
      addNewDummyComment(res.data.data);
    } else if (selectedCommentId) {
      addNewDummyComment(selectedCommentId);
    }
    console.log('dailyNewComment::', res.data.data);
    if (
      res.data.apiStatus.apiCode === 200 ||
      res.data.apiStatus.apiCode === 201
    ) {
      console.log('1111:: ');
      setToastText((toast) =>
        updateSameText(
          `댓글이 ${SubmitButtonState === 'submit' ? '등록' : '수정'}되었어요.`,
          toast,
        ),
      );
      // 리뷰 등록/수정에 따라 결과를 핸들링하기
    }
    dispatch(setRemoveCommentTargetIndex());
    dispatch(resetCommentData());
  };
  // 네비게이션 이동 감지
  useEffect(
    () =>
      navigationDetect.addListener('beforeRemove', (e) => {
        if (
          e.data.action.type === 'NAVIGATE' ||
          (!params.ids?.fromHome &&
            !params.ids?.fromProfile &&
            !params.ids?.fromKeep &&
            !params.ids?.fromUser)
        ) {
          return;
        }
        e.preventDefault();
        if (params.ids.fromHome) {
          RootNavigation.navigate('GroupHomeScreen', {
            groupId,
            isRefresh,
          });
        } else if (params.ids.fromProfile) {
          console.log(isRefresh);
          RootNavigation.navigate('ProfileWrittenScreen', {
            isRefresh,
          });
        } else if (params.ids.fromKeep) {
          RootNavigation.navigate('ProfileKeepScreen', {
            isRefresh,
          });
        } else if (params.ids.fromUser) {
          RootNavigation.navigate('GroupUserScreen', {
            groupId,
            mid: data?.dailyDetail.mid,
            isRefresh,
          });
        }
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [navigationDetect, isRefresh, data],
  );

  const handleMyKeep = () => {
    setIsApiLoading(true);
    setIsMyKeep((state) => !state);
    callApi(
      postDailyKeep,
      params?.ids ? params.ids : params.alarmData,
      submitMyKeep,
    );
  };

  useEffect(() => {
    dispatch(setLoginMemberName(data?.loginMemberName));
    dispatch(setCommentList(data?.comments));
  }, [dispatch, data]);

  useFocusEffect(
    useCallback(() => {
      if (params.ids?.isRefresh) {
        setIsRefresh(params.ids.isRefresh);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params]),
  );

  const [alarmScrollEnd, setAlarmScrollEnd] = useState(0);
  useEffect(() => {
    const scroll = () => {
      console.log(scrollIdx, commentData?.length);

      try {
        if (
          alarmScrollEnd < 300 &&
          params?.fromScreen === 'AlarmMainScreen' &&
          params?.alarmType !== 'KPS_FCR' &&
          params?.alarmType !== 'KPS_GND' &&
          (scrollIndex >= 0 ||
            (typeof scrollIndex === 'object' && scrollIndex[0] >= 0)) &&
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
  const formSubmit = () => {
    // 새로운 댓글 등록 API 작성해야함
    let apiData;
    const ids = params?.ids
      ? params.ids
      : {
          groupId,
          dailyId,
        };
    if (SubmitButtonState === 'submit') {
      apiData = Object.assign(ids, {
        commentData: Object.assign(form, selectedCommentData),
      });
      console.log('apiData:: ', apiData);
      callApi(postDailyComment, apiData, commentSubmit);
    } else if (SubmitButtonState === 'edit') {
      const commentId = selectedCommentData?.commentId;
      const selectedCommentDataCopy = { ...selectedCommentData };
      delete selectedCommentDataCopy.commentId;
      console.log('SS:: ', selectedCommentDataCopy, commentId);
      apiData = Object.assign(
        ids,
        {
          commentData: Object.assign(form, selectedCommentDataCopy),
        },
        { commentId },
      );

      callApi(patchDailyComment, apiData, commentSubmit);
    }
    setForm({
      comment: '',
      image: '',
    });

    dispatch(setSubmitButtonState('submit'));
  };
  const handleDeleteDaily = (res) => {
    if (
      res.data.apiStatus.apiCode === 200 ||
      res.data.apiStatus.apiCode === 201
    ) {
      if (params?.ids?.fromHome) {
        RootNavigation.navigate('GroupHomeScreen', {
          groupId,
          toastText: '일상글이 삭제되었어요.',
          isRefresh: true,
        });
      } else if (params?.ids?.fromProfile) {
        RootNavigation.navigate('ProfileWrittenScreen', {
          toastText: '일상글이 삭제되었어요.',
          isRefresh: true,
        });
      } else if (params?.alarmData) {
        // RootNavigation.navigate('GroupHomeScreen', {
        //   groupId: params.alarmData.groupId,
        //   toastText: '일상글이 삭제되었어요.',
        //   isRefresh: true,
        // });
        RootNavigation.goBack();
      }
    }
  };
  const headerOptionClick = () => {
    // 일상 수정부분 데이터받으면 수정하기
    if (MID === data?.dailyDetail?.mid) {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['닫기', '수정하기', '삭제하기'],
          cancelButtonIndex: 0,
          destructiveButtonIndex: 2,
          userInterfaceStyle: 'light',
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
            console.log('cancel');
          } else if (buttonIndex === 1) {
            console.log('data.dailyDetail:: ', data.dailyDetail);
            RootNavigation.navigate('DailyPostScreen', {
              nowPage: 'daily_edit',
              groupId,
              dailyId,
              dailyData: data.dailyDetail,
              fromDetailScreen: params.ids.fromHome
                ? 'Home'
                : params.ids.fromKeep
                ? 'Keep'
                : params.ids.fromProfile
                ? 'Profile'
                : params.ids.fromUser
                ? 'User'
                : null,
            });
          } else if (buttonIndex === 2) {
            // 리뷰 삭제 API
            setExitModalVisible(true);
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
            console.log('cancel');
          } else if (buttonIndex === 1) {
            // 신고 API 생성되면 작성하기
            callApi(
              postReport,
              {
                reportType: 'DAILY',
                typeId: dailyId,
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
        updateSameText('해당 일상글이 신고되었어요.', toast),
      );
    }
  };

  return (
    <Screen toastText={toastText}>
      {data === 822 ? (
        <>
          <AppHeader
            title="일상"
            leftIcon={Svg('back_thin')}
            leftIconPress={() => navigation.goBack()}
            titleType="center"
            style={styles.headerStyle}
            rightIcon={<MyIcon name="ic_etc" size={toSize(24)} />}
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
            title="일상"
            leftIcon={Svg('back_thin')}
            leftIconPress={() => navigation.goBack()}
            titleType="center"
            style={styles.headerStyle}
            rightIcon={<MyIcon name="ic_etc" size={toSize(24)} />}
            rightIconPress={() => headerOptionClick()}
            rightSecondIcon={
              isMyKeep
                ? Svg('keep_on')
                : params?.ids?.isDelete
                ? Svg('keep_off_delete')
                : Svg('keep_off')
            }
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
                dailyDetail={data?.dailyDetail}
                commentLength={commentData?.length}
                isImage={params?.isImage ? params.isImage : false}
              />
            }
            renderItem={({ item }) => (
              <Comment
                groupId={groupId}
                setToastText={setToastText}
                commentData={item}
                keyboardInputRef={keyboardInputRef}
                loginMemberProfileUrl={data?.loginMemberProfileUrl}
                setForm={setForm}
                params={params}
                type="daliy"
              />
            )}
            ListFooterComponent={
              <View style={styles.commentFooterView}>
                <AppTouchable
                  style={styles.commentFooterButton}
                  onPress={() => keyboardInputRef.current.focus()}
                >
                  <AppText color={colors.primary}>댓글 달기</AppText>
                </AppTouchable>
              </View>
            }
          />
          <ReviewDetailKeyboard
            form={form}
            setForm={setForm}
            formSubmit={formSubmit}
            keyboardInputRef={keyboardInputRef}
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
          callApi(deleteDaily, { groupId, dailyId }, handleDeleteDaily);
          // callApi(deleteReview, params.ids, handleDeleteReivew);
        }}
      />
    </Screen>
  );
};

export default DailyDetailScreen;
