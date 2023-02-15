import React, { useEffect, useRef, useState } from 'react';
import { FlatList } from 'react-native';
import Config from 'react-native-config';
import { useDispatch, useSelector } from 'react-redux';
import {
  getReviewDetailComment,
  patchReviewComment,
  postReviewComment,
} from '../../../api/review';
import Svg from '../../../asset/svg';
import AppHeader from '../../../component/common/appHeader';
import Comment from '../../../component/review/detailScreen/Comment';
import ReviewDetailKeyboard from '../../../component/review/detailScreen/reviewDetailKeyboard';
import { toSize } from '../../../config/globalStyle';
import { callApi } from '../../../function/auth';
import updateSameText from '../../../function/updateSameText';
import RootNavigation from '../../../RootNavigation';
import {
  resetCommentData,
  scrollReachTopCommentList,
  setCommentList,
  setEditComment,
  setNewComment,
  setSubmitButtonState,
} from '../../../store/feature/reviewSlice';
import Screen from '../../Screen';

const ReviewDetailCommentScreen = ({ route: { params } }) => {
  const [data, setData] = useState();
  console.log('data:: ', data);
  // const [commentList, setCommentList] = useState();
  const commentList = useSelector((state) => state.review.commentList);

  console.log('data?.comments?.length:: ', data?.comments?.length);
  const [nextOffset, setNextOffset] = useState(1);
  const ids = useSelector((state) => state.user.ids);
  console.log('comment data:: ', data?.comments);
  const commentTargetIndex = useSelector(
    (state) => state.review.commentTargetIndex,
  );
  const flatListRef = useRef();
  const [form, setForm] = useState({
    comment: '',
    image: '',
  });
  const SubmitButtonState = useSelector((state) => state.review.submitButton);
  const keyboardInputRef = useRef();
  const [toastText, setToastText] = useState();
  const dispatch = useDispatch();

  const selectedCommentData = useSelector(
    (state) => state.review.selectedCommentData,
  );

  const commentSubmit = (res) => {
    console.log('resCOMMENT:: ', res, res.data.apiStatus.apiCode);
    // 리뷰 등록/수정에 따라 결과를 핸들링하기
    console.log('res:: ', res.data);
    if (
      res.data.apiStatus.apiCode !== 200 &&
      res.data.apiStatus.apiCode !== 201
    ) {
      return;
    }
    const newComment = {
      // 임시 ID를 난수로 가집니다.
      commentId: res.data.data,
      memberName: res.data?.memberName,
      memberId: data?.memberId,
      memberProfileUrl: `${Config.SERVER_URI}/files/profile/small${data?.memberProfileUrl}`,
      comment: form.comment,
      createDt: '방금 전',
      imageUrl: form.image,
      // childComments: [],
      // targetName: data?.comments?.targetName,
      // targetMid: data?.comments?.targetMid,
      status: 'CREATED',
    };
    // callApi(getReviewDetail, params.ids, getData);
    dispatch(setNewComment(newComment));
    setToastText(
      updateSameText(
        `댓글이 ${SubmitButtonState === 'submit' ? '등록' : '수정'}되었어요.`,
      ),
    );
  };

  const scrollReachTop = async () => {
    console.log('TOP');

    const commentData = await getReviewDetailComment({
      groupId: ids.groupId,
      reviewId: ids.reviewId,
      limit: 20,
      nextOffset,
    });

    setNextOffset(commentData?.data?.data?.nextOffset);
    if (
      commentData?.data?.data?.comments[0]?.commentId !==
      commentList[0]?.commentId
    ) {
      dispatch(scrollReachTopCommentList(commentData?.data?.data?.comments));
      // setCommentList((comments) => [
      //   ...commentData?.data?.data?.comments,
      //   ...comments,
      // ]);
    }
  };
  const formSubmit = () => {
    let apiData;
    if (SubmitButtonState === 'submit') {
      apiData = Object.assign(
        {
          groupId: ids.groupId,
          reviewId: ids.reviewId,
        },
        {
          commentData: Object.assign(form, selectedCommentData),
        },
      );
      callApi(postReviewComment, apiData, commentSubmit);
    } else if (SubmitButtonState === 'edit') {
      const commentId = selectedCommentData?.commentId;
      const selectedCommentDataCopy = { ...selectedCommentData };
      delete selectedCommentDataCopy.commentId;
      apiData = Object.assign(
        {
          groupId: ids.groupId,
          reviewId: ids.reviewId,
        },

        {
          commentData: Object.assign(form, selectedCommentDataCopy),
        },
        { commentId },
      );
      dispatch(setEditComment({ image: form?.image }));
      callApi(patchReviewComment, apiData, commentSubmit);
    }
    setForm({
      comment: '',
      image: '',
    });
    dispatch(setSubmitButtonState('submit'));
    dispatch(resetCommentData());
  };

  useEffect(() => {
    if (commentList && commentList?.length <= 20) {
      flatListRef?.current?.scrollToIndex({
        index: commentList?.length - 1,
        viewPosition: 0,
        viewOffset: toSize(-29),
        animated: false,
      });
    } else if (commentList && commentList?.length > 20) {
      flatListRef?.current?.scrollToIndex({
        index: 20,
        viewPosition: 0,
        // viewOffset: toSize(-29),
        animated: false,
      });
    }
  }, [commentList]);

  useEffect(() => {
    const getData = async () => {
      const commentData = await getReviewDetailComment({
        groupId: ids.groupId,
        reviewId: ids.reviewId,
        limit: 20,
        nextOffset: 0,
      });
      if (nextOffset) {
        setNextOffset(commentData?.data?.data?.nextOffset);
        setData(commentData?.data?.data);
        dispatch(setCommentList(commentData?.data?.data?.comments));
        // setCommentList(commentData?.data?.data?.comments);
      }
    };
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids]);
  return (
    <Screen toastText={toastText}>
      <AppHeader
        leftIcon={Svg('back_thin')}
        leftIconPress={() => RootNavigation.goBack()}
        title={`댓글 ${commentList?.length}`}
      />
      <FlatList
        ref={flatListRef}
        scrollEventThrottle={0}
        onScrollToIndexFailed={(info) => {
          const wait = new Promise((resolve) => setTimeout(resolve, 300));
          wait.then(() => {
            flatListRef.current?.scrollToIndex({
              index: info.index,
              animated: false,
            });
          });
        }}
        onScroll={(e) => {
          let paddingToBottom = 1;
          paddingToBottom += e.nativeEvent.layoutMeasurement.height;
          console.log(e.nativeEvent.contentOffset.y);
          if (e.nativeEvent.contentOffset.y <= 0) {
            scrollReachTop();
          }
          // 스크롤이 바닥에 도착했을 때 if문 통과
          if (
            e.nativeEvent.contentOffset.y + paddingToBottom >=
            e.nativeEvent.contentSize.height
          ) {
            // console.log(Math.floor(paddingToBottom) + "-" + Math.floor(e.nativeEvent.contentOffset.y) + "-" + Math.floor(e.nativeEvent.contentSize.height));
            console.log('reach');
          }
        }}
        enableResetScrollToCoords={false}
        keyboardShouldPersistTaps={'handled'}
        keyExtractor={(item) => item.commentId}
        data={commentList}
        renderItem={({ item }, index) => (
          <Comment
            refreshing={true}
            commentData={item}
            index={index}
            keyboardInputRef={keyboardInputRef}
            loginMemberProfileUrl={data?.memberProfileUrl}
            setForm={setForm}
            params={params}
            ids={ids}
            type="review"
            setToastText={setToastText}
          />
        )}
      />

      <ReviewDetailKeyboard
        form={form}
        setForm={setForm}
        formSubmit={formSubmit}
        keyboardInputRef={keyboardInputRef}
      />
    </Screen>
  );
};

export default ReviewDetailCommentScreen;
