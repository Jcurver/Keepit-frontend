import { KI } from 'api/index.js';

// 리뷰 생성
export const postReview = async ({ groupId, reviewData }) => {
  return await KI.post(`/groups/${groupId}/reviews`, reviewData);
};

// 리뷰 수정
export const patchReview = async ({ groupId, reviewData, reviewId }) => {
  return await KI.patch(`/groups/${groupId}/reviews`, {
    ...reviewData,
    reviewId,
  });
};

// 리뷰 댓글, 대댓글
export const postReviewComment = async ({ groupId, reviewId, commentData }) => {
  return await KI.post(
    `/groups/${groupId}/reviews/${reviewId}/comment`,
    commentData,
  );
};
// 리뷰 댓글 수정
export const patchReviewComment = async ({
  groupId,
  reviewId,
  commentId,
  commentData,
}) => {
  return await KI.patch(
    `/groups/${groupId}/reviews/${reviewId}/comment/${commentId}`,
    commentData,
  );
};

// 리뷰 상세 조회
export const getReviewDetail = async ({ groupId, reviewId }) => {
  return await KI.get(`/groups/${groupId}/reviews/${reviewId}`);
};

// 리뷰 킵
export const postReviewKeep = async ({ groupId, reviewId }) => {
  return await KI.post(`/groups/${groupId}/reviews/${reviewId}/keep`, {});
};

// 리뷰 삭제
export const deleteReview = async ({ groupId, reviewId }) => {
  return await KI.delete(`/groups/${groupId}/reviews/${reviewId}`);
};

// 리뷰 댓글 삭제
export const deleteReviewComment = async ({ groupId, reviewId, commentId }) => {
  return await KI.delete(
    `/groups/${groupId}/reviews/${reviewId}/comment/${commentId}`,
  );
};

export const deleteReviewServerImage = async () => {
  return await KI.delete('/image/review');
};
