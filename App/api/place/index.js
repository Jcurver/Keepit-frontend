import { KI } from 'api/index.js';

export const postPlace = async (placeInfo) => {
  return await KI.post('/places', placeInfo);
};

/**
 * 장소 내 리뷰 조회
 * @param {*} params.lastReviewId
 * @param {*} params.lastReviewSeq
 */
export const getPlaceReview = async (params) => {
  return await KI.get(
    `/places/${params.placeId}/groups/${params.groupId}/reviews`,
    {
      pageSize: params.pageSize,
      lastReviewSeq: params?.lastReviewSeq,
    },
  );
};
