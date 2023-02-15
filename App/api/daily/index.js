import { KI, KInoHeader } from 'api/index.js';

// 일상글 생성
export const postDaily = async ({ groupId, dailyData }) => {
  return await KI.post(`/groups/${groupId}/daily`, dailyData);
};

// 일상글 수정
export const patchDaily = async ({ groupId, dailyData }) => {
  return await KI.patch(`/groups/${groupId}/daily`, dailyData);
};

// 일상글 댓글, 대댓글
export const postDailyComment = async ({ groupId, dailyId, commentData }) => {
  return await KI.post(
    `/groups/${groupId}/daily/${dailyId}/comment`,
    commentData,
  );
};

// 일상글 상세 조회
export const getDailyDetail = async ({ groupId, dailyId }) => {
  return await KI.get(`/groups/${groupId}/daily/${dailyId}`);
};

// 일상글 킵
export const postDailyKeep = async ({ groupId, dailyId }) => {
  return await KI.post(`/groups/${groupId}/daily/${dailyId}/keep`);
};

// 일상글 삭제
export const deleteDaily = async ({ groupId, dailyId }) => {
  return await KI.delete(`/groups/${groupId}/daily/${dailyId}`);
};

// 일상글 댓글 수정
export const patchDailyComment = async ({
  groupId,
  dailyId,
  commentId,
  commentData,
}) => {
  return await KI.patch(
    `/groups/${groupId}/daily/${dailyId}/comment/${commentId}`,
    commentData,
  );
};

// 일상글 댓글 삭제
export const deleteDailyComment = async ({ groupId, dailyId, commentId }) => {
  return await KI.delete(
    `/groups/${groupId}/daily/${dailyId}/comment/${commentId}`,
  );
};
