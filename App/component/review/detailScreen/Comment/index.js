import React, { useRef, useState, useEffect } from 'react';
import { View, Image, FlatList, ActionSheetIOS, Modal } from 'react-native';
import { colors, toSize } from '../../../../config/globalStyle';
import MyIcon from '../../../../config/icon-font';
import AppText from '../../../common/appText';
import { styles } from './style';
import AppTouchable from '../../../common/appTouchable';
import Toast from 'react-native-simple-toast';
import Clipboard from '@react-native-clipboard/clipboard';
import { useDispatch, useSelector } from 'react-redux';
import {
  setSubmitButtonState,
  setCommentTargetIndex,
  setCommentData,
  setSelectedCommentId,
} from 'store/feature/reviewSlice';
import writtenDate from 'function/writtenDate';
import Config from 'react-native-config';
import store from '../../../../store';
import { callApi } from '../../../../function/auth';
import { deleteReviewComment } from '../../../../api/review';
import { deleteDailyComment } from '../../../../api/daily';
import AppImage from '../../../common/appImage';
import Svg from '../../../../asset/svg';
import updateSameText from '../../../../function/updateSameText';
import { image_small } from '../../../../constants/imageSize';
import { postReport } from '../../../../api/group';
import RootNavigation from '../../../../RootNavigation';
import jwt_decode from 'jwt-decode';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '@gorhom/bottom-sheet';

const deleteCommentSubmit = (res) => {
  console.log('deleteRes:: ', res);
  // if (
  //   res.data.apiStatus.apiCode === 200 ||
  //   res.data.apiStatus.apiCode === 201
  // ) {
  //   Toast.showWithGravity('댓글이 삭제되었어요.', Toast.SHORT, Toast.TOP, [
  //     'RCTModalHostViewController',
  //   ]);
  // }
};

const commentPress = ({
  dispatch,
  commentData,
  keyboardInputRef,
  setToastText,
  setForm,
  setCommentStatus,
  parentCommentId,
  MID,
  params,
  type,
  groupId,
  groupIsDelete = false,
}) => {
  const isMyComment = commentData.memberId === MID;
  console.log('MID:: ', MID, commentData.memberId);
  console.log('commentData.commentId:: ', commentData.commentId);
  // console.log('commentDataAAAA:: ', commentData);
  const deleteMyComment = () => {
    if (params.ids) {
      callApi(
        type === 'review' ? deleteReviewComment : deleteDailyComment,
        Object.assign(params.ids, { commentId: commentData.commentId }),
        deleteCommentSubmit,
      );
    } else if (params.alarmData) {
      type === 'review'
        ? callApi(
            deleteReviewComment,
            {
              groupId: params?.alarmData?.groupId,
              reviewId: params?.alarmData?.reviewId,
              commentId: commentData.commentId,
            },

            deleteCommentSubmit,
          )
        : callApi(
            deleteDailyComment,
            {
              groupId: params?.alarmData?.groupId,
              dailyId: params?.alarmData?.dailyId,
              commentId: commentData.commentId,
            },

            deleteCommentSubmit,
          );
    }
    setCommentStatus('DELETED');
    setToastText((toast) => updateSameText('댓글이 삭제되었어요.', toast));
  };
  const clickReportOrDelete = () => {
    if (isMyComment) {
      if (params.ids) {
        callApi(
          type === 'review' ? deleteReviewComment : deleteDailyComment,
          Object.assign(params.ids, { commentId: commentData.commentId }),
          deleteCommentSubmit,
        );
      } else if (params.alarmData) {
        type === 'review'
          ? callApi(
              deleteReviewComment,
              {
                groupId: params?.alarmData?.groupId,
                reviewId: params?.alarmData?.reviewId,
                commentId: commentData.commentId,
              },

              deleteCommentSubmit,
            )
          : callApi(
              deleteDailyComment,
              {
                groupId: params?.alarmData?.groupId,
                dailyId: params?.alarmData?.dailyId,
                commentId: commentData.commentId,
              },

              deleteCommentSubmit,
            );
      }
      setCommentStatus('DELETED');
      setToastText((toast) => updateSameText('댓글이 삭제되었어요.', toast));
    } else {
      // 신고 로직 API
      callApi(
        postReport,
        {
          reportType: 'COMMENT',
          typeId: commentData.commentId,
        },
        reportSuccess,
      );
    }
  };

  ActionSheetIOS.showActionSheetWithOptions(
    {
      options:
        isMyComment && !groupIsDelete
          ? ['닫기', '복사하기', '수정하기', '삭제하기']
          : isMyComment && groupIsDelete
          ? ['닫기', '복사하기', '삭제하기']
          : !isMyComment && !groupIsDelete
          ? ['닫기', '복사하기', '답글쓰기', '신고하기']
          : ['닫기', '복사하기', '신고하기'],
      destructiveButtonIndex: groupIsDelete ? 2 : 3,
      cancelButtonIndex: 0,
    },
    (buttonIndex) => {
      if (buttonIndex === 0) {
        //cancel
      } else if (buttonIndex === 1) {
        Clipboard.setString(commentData.comment);
        setToastText((toast) => updateSameText('댓글이 복사됐어요.', toast));
      } else if (buttonIndex === 2) {
        if (groupIsDelete) {
          clickReportOrDelete();
        } else {
          // 댓글 대댓글 수정
          if (isMyComment) {
            setForm({
              image: commentData.imageUrl,
              comment: commentData.comment,
            });
            dispatch(setCommentTargetIndex({ commentData, parentCommentId }));
            dispatch(setSubmitButtonState('edit'));
            // 대댓글 수정
            if (parentCommentId) {
              // 대댓글에 답글을 달아서 타겟팅할 mid가 있는 경우
              if (commentData?.targetMid) {
                dispatch(
                  setCommentData({
                    parentCommentId,
                    targetMid: commentData?.targetMid,
                    commentId: commentData?.commentId,
                  }),
                );
                // 대댓글이 아닌 댓글에 답글을 달아서 타겟팅할 mid가 없는경우
              } else {
                dispatch(
                  setCommentData({
                    parentCommentId,
                    commentId: commentData?.commentId,
                  }),
                );
              }
              // 댓글 수정 targetMid 생기면 달기
            } else {
              dispatch(setCommentData({ commentId: commentData?.commentId }));
            }
          } else {
            // 댓글 대댓글 달기
            dispatch(setCommentTargetIndex({ commentData, parentCommentId }));
            // 대댓글을 타겟팅해서 대댓글 달기
            if (parentCommentId) {
              dispatch(
                setCommentData({
                  parentCommentId,
                  targetMid: commentData?.memberId,
                  targetCommentId: commentData?.commentId,
                }),
              );
              // 댓글을 타겟팅해서 대댓글 달기
            } else {
              dispatch(
                setCommentData({
                  parentCommentId: commentData?.commentId,
                  targetCommentId: commentData?.commentId,
                }),
              );
            }
          }
        }
        keyboardInputRef?.current?.focus();
      } else if (buttonIndex === 3) {
        clickReportOrDelete();
      }
    },
  );
  const reportSuccess = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      console.log(' 신고 res.data:: ', res.data);
      setToastText((toast) =>
        updateSameText('해당 댓글이 신고되었어요.', toast),
      );
    }
  };
};

const CommentContainer = ({
  index = undefined,
  commentData,
  keyboardInputRef,
  setForm,
  parentCommentId = undefined,
  params,
  type,
  setToastText,
  groupId,
  groupIsDelete,
}) => {
  const dispatch = useDispatch();
  const MID = useSelector((state) => state.user?.authInfo?.MID);
  // const MID = useSelector((state) => state.user?.authInfo?.MID);
  // console.log('FORM2', setForm, setToastText)prod
  const [commentStatus, setCommentStatus] = useState(commentData.status);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  if (!imageViewerVisible) {
    return (
      <>
        <View style={[styles.container, styles.flexRow]}>
          {parentCommentId && Svg('arrow_Down_Right')}
          <View
            style={[styles.width100, parentCommentId && styles.nestedContainer]}
          >
            {commentStatus === 'CREATED' ? (
              <>
                <View style={styles.profileView}>
                  <AppTouchable
                    onPress={() => {
                      RootNavigation.navigate('GroupUserScreen', {
                        groupId,
                        mid: commentData?.memberId,
                        fromDetail: true,
                        isRefresh: true,
                      });
                    }}
                    style={styles.profile}
                  >
                    <AppImage
                      noImage={commentData?.memberProfileUrl === ''}
                      type="profile"
                      source={{
                        uri: `${Config.IMAGE_SERVER_URI}/${commentData?.memberProfileUrl}${image_small}`,
                      }}
                      style={styles.avatar}
                    />
                    <AppText size={12} color={colors.Color6B6A6A}>
                      {commentData?.memberName}
                    </AppText>
                  </AppTouchable>
                  <AppTouchable
                    style={styles.nested_etc_large_virtical}
                    onPress={() => {
                      keyboardInputRef?.current?.blur();
                      dispatch(setSelectedCommentId(commentData?.commentId));
                      commentPress({
                        dispatch,
                        commentData,
                        keyboardInputRef,
                        setForm,
                        setCommentStatus,
                        parentCommentId,
                        MID,
                        params,
                        type,
                        setToastText,
                        groupId,
                        groupIsDelete,
                      });
                    }}
                  >
                    <MyIcon name="etc_large_vertical" size={toSize(16)} />
                  </AppTouchable>
                </View>
                {commentData?.imageUrl &&
                commentData.imageUrl !== 'none images' ? (
                  <AppTouchable
                    opacity={1}
                    onPress={() => setImageViewerVisible(true)}
                  >
                    <AppImage
                      style={styles.commentImage}
                      source={{ uri: commentData.imageUrl }}
                    />
                  </AppTouchable>
                ) : null}

                {commentData?.comment !== '' && (
                  <AppText>
                    {commentData?.targetName && (
                      <AppText style={styles.targetName} weight="bold">
                        {commentData.targetName}
                      </AppText>
                    )}{' '}
                    <AppText
                      style={styles.commentText}
                      color={colors.Color191919}
                    >
                      {commentData.comment}
                    </AppText>
                  </AppText>
                )}
              </>
            ) : (
              <AppText style={styles.commentText} color={colors.Color6B6A6A}>
                {commentStatus === 'DELETED' && '삭제된 댓글입니다.'}
                {commentStatus === 'BLOCKED' &&
                  '신고에 의해 숨김 처리된 글입니다.'}
              </AppText>
            )}
            <AppText size={12} color={colors.Color6B6A6A}>
              {writtenDate(commentData.createDt)}
            </AppText>
          </View>
        </View>
        <View style={[styles.grayLine]} />
      </>
    );
  } else {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        style={styles.modalRelative}
      >
        <AppTouchable
          onPress={() => setImageViewerVisible(false)}
          style={styles.modalClose}
        >
          <MyIcon name="ic_close" size={toSize(14)} color={'white'} />
        </AppTouchable>
        <View style={styles.modalContainer}>
          <View style={styles.imageContainer}>
            <AppImage
              source={{ uri: commentData.imageUrl.split('?')[0] }}
              resizeMode="contain"
              style={{
                width: WINDOW_WIDTH,
                height: WINDOW_HEIGHT,
              }}
            />
          </View>
        </View>
      </Modal>
    );
  }
};

const Comment = ({
  commentData,
  keyboardInputRef,
  setForm,
  params,
  type,
  setToastText,
  isData = true,
  groupId,
  groupIsDelete,
}) => {
  if (!isData) {
    return (
      <View style={styles.paddingContent}>
        <View style={[styles.container, styles.flexRow]}>
          <View style={[styles.width100]}>
            <View style={styles.profileView}>
              <View style={styles.profile}>
                <AppImage
                  noImage={commentData?.memberProfileUrl === ''}
                  type="profile"
                  source={{
                    uri: `${Config.IMAGE_SERVER_URI}/${commentData?.memberProfileUrl}${image_small}`,
                  }}
                  style={styles.avatar}
                />
                <AppText
                  size={12}
                  color={colors.Color6B6A6A}
                  isData={false}
                  sWidth={60}
                >
                  {commentData?.memberName}
                </AppText>
              </View>
              <AppTouchable style={styles.nested_etc_large_virtical}>
                <MyIcon name="etc_large_vertical" size={toSize(16)} />
              </AppTouchable>
            </View>
            <AppText>
              <AppText style={styles.targetName} weight="bold">
                {commentData?.targetName}
              </AppText>

              <AppText> </AppText>
              <AppText
                style={styles.commentText}
                color={colors.Color191919}
                isData={false}
                sWidth={250}
              >
                {commentData?.comment}
              </AppText>
            </AppText>

            <AppText
              size={12}
              color={colors.Color6B6A6A}
              isData={false}
              sWidth={40}
            >
              {writtenDate(commentData?.createDt)}
            </AppText>
          </View>
        </View>
        <View style={[styles.grayLine]} />
      </View>
    );
  }
  return (
    <View style={styles.paddingContent}>
      <CommentContainer
        commentData={commentData}
        keyboardInputRef={keyboardInputRef}
        setForm={setForm}
        params={params}
        setToastText={setToastText}
        type={type}
        groupId={groupId}
        groupIsDelete={groupIsDelete}
      />
      <FlatList
        keyExtractor={(item) => item.commentId}
        data={commentData.childComments}
        renderItem={({ item, index }) => (
          <CommentContainer
            key={`review_comment_${index}`}
            commentData={item}
            parentCommentId={commentData.commentId}
            index={index}
            keyboardInputRef={keyboardInputRef}
            setForm={setForm}
            params={params}
            type={type}
            setToastText={setToastText}
            groupId={groupId}
            groupIsDelete={groupIsDelete}
          />
        )}
      />
    </View>
  );
};

export default Comment;
