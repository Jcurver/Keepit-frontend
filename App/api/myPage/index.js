import { KI } from 'api/index.js';

/**
 * 마이페이지 메인
 */
export const getMypageHome = async () => {
  return await KI.get('/mypage/home');
};

/**
 * 그룹 목록 불러오기
 */
export const getMypageGroups = async () => {
  return await KI.get('/mypage/groups');
};

/**
 * 나의 리뷰 불러오기
 * @param {*} params.groupId 그룹 아이디(없이 요청시 모든 그룹 조회)
 * @param {*} params.lastSeq 마지막 리뷰 seq
 * @param {*} params.pageSize
 */
export const getMypageReviews = async (params) => {
  return await KI.get('/mypage/reviews', params);
};

/**
 * 나의 일상글 불러오기
 * @param {*} params.groupId 그룹 아이디(없이 요청시 모든 그룹 조회)
 * @param {*} params.lastSeq 마지막 일상 seq
 * @param {*} params.pageSize
 */
export const getMypageDaily = async (params) => {
  return await KI.get('/mypage/daily', params);
};

/**
 * 나의 작성댓글 불러오기
 * @param {*} params.groupId 그룹 아이디(없이 요청시 모든 그룹 조회)
 * @param {*} params.offset 마지막 작성댓글 seq
 * @param {*} params.pageSize
 */
export const getMypageComment = async (params) => {
  return await KI.get('/mypage/comments', params);
};

/**
 * 나의 팔로우 리스트 조회
 * @param {*} params.pageSize
 * @param {*} params.nextOffset 마지막 작성댓글 seq
 */
export const getMypageFollowing = async (params) => {
  return await KI.get('/mypage/following', params);
};

/**
 * 킵한 리뷰 조회
 * @param {*} params.pageSize
 * @param {*} params.nextOffset 마지막 리뷰 seq
 */
export const getMypageKeepReviews = async (params) => {
  return await KI.get('/mypage/keep/reviews', params);
};

/**
 * 킵한 일상 조회
 * @param {*} params.pageSize
 * @param {*} params.nextOffset 마지막 일상 seq
 */
export const getMypageKeepDaily = async (params) => {
  return await KI.get('/mypage/keep/daily', params);
};

/**
 * 킵 편집
 * @param {*} params.type "REVIEW", "DAILY"
 * @param {*} params.keepSeqList 킵 seq리스트
 * @param {*} params.isAll 전체 삭제 여부
 */
export const patchMypageKeep = async (params) => {
  return await KI.patch('/mypage/keep/edit', params);
};

/**
 * 회원 정보 업데이트
 * @param {*} params.name
 * @param {*} params.profileUrl
 */
export const patchMembers = async (params) => {
  return await KI.patch('/members', params);
};

/**
 * 문의하기
 * @param {*} params.email
 * @param {*} params.detail
 */
export const postMypageInquiry = async (params) => {
  return await KI.post('/mypage/inquiry', params);
};

/**
 * 차단 리스트 조회
 * @param {*} params.pageSize
 * @param {*} params.nextOffset
 */
export const getMypageBlock = async (params) => {
  return await KI.get('/mypage/blocks', params);
};

/**
 * 그룹관리 (전체, 내 그룹, 탈퇴 그룹) 조회
 * @param {*} params.type 각 탭의 타입 전체 그룹 : ALL 내 그룹 : MY 탈퇴 그룹 : WITHDRAWAL
 */
export const getMypageGroupsManagement = async (params) => {
  return await KI.get('/mypage/groups/management', params);
};

/**
 * 탈퇴 그룹 글 전체 삭제
 * @param {*} params.groupId
 */
export const deleteMypageGroupsWritings = async (params) => {
  return await KI.delete(`/mypage/groups/${params.groupId}/writings`);
};

/**
 * 휴대폰 번호 변경
 * @param {*} params.phone
 * @param {*} params.authNum
 */
export const patchMypagePhone = async (params) => {
  return await KI.patch('/mypage/change_phone', params);
};

/**
 * 공지사항 조회
 * @param {*} params.pageSize
 * @param {*} params.lastNoticeId
 */
export const getNotice = async (params) => {
  return await KI.get('/notices', params);
};

/**
 * 공지사항 상세 조회
 * @param {*} params.noticeId
 */
export const getNoticeDetail = async (params) => {
  return await KI.get(`/notices/${params.noticeId}`);
};
