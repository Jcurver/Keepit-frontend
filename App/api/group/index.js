import { KI } from 'api/index.js';

/**
 * 그룹 생성
 * @param {String} apiData.name
 * @param {String} apiData.description
 * @param {String} apiData.password
 * @param {Boolean} apiData.usePrivate
 * @param {Int} apiData.memberQuantity
 * @param {String} apiData.profileUrl
 * @param {String} apiData.category
 */
export const postGroups = async (apiData) => {
  return await KI.post('/groups', apiData);
};

/**
 * 그룹 수정
 * @param {String} apiData.groupId
 * @param {String} apiData.name
 * @param {String} apiData.description
 * @param {String} apiData.password
 * @param {Boolean} apiData.usePrivate
 * @param {Int} apiData.memberQuantity
 * @param {String} apiData.profileUrl
 * @param {String} apiData.category
 */
export const patchGroups = async (params) => {
  return await KI.patch(`/groups/${params.groupId}`, params.data);
};

/**
 * 그룹 이름 중복 체크
 * @param {String} groupName
 */
export const getGroupsExists = async (groupName) => {
  return await KI.get('/groups/exists', { groupName });
};

/**
 * 그룹 삭제
 * @param {String} groupId
 */
export const deleteGroups = async (groupId) => {
  return await KI.delete(`/groups/${groupId}`);
};

/**
 * 그룹 나가기
 * @param {String} groupId
 */
export const deleteGroupsLeave = async (groupId) => {
  return await KI.delete(`/groups/${groupId}/leave`);
};

/**
 * 그룹 찾기
 */
export const getGroups = async (params) => {
  return await KI.post('/groups', { params });
};

/**
 * 내 그룹
 * @param {String} params.type 'ALl' / 'FAVORIㄹTE'
 */
export const getMyGroups = async (params) => {
  return await KI.get('/groups/my-groups', params);
};

/**
 * 그룹 자주찾기
 * @param {String} groupId
 */
export const postGroupsFavorite = async (groupId) => {
  return await KI.post(`/groups/${groupId}/favorite`);
};

/**
 * 그룹 검색
 * @param {Long} params.pageSize
 * @param {String} params.search
 * @param {Long} params.lastGroupId
 */
export const getGroupsSearch = async (params) => {
  return await KI.get('/groups/search', params);
};

/**
 * 그룹 조회
 * @param {String} groupId
 */
export const getGroupsDetail = async (groupId) => {
  return await KI.get(`/groups/${groupId}`);
};

/**
 * 그룹 홈 조회
 * @param {String} groupId
 */
export const getGroupsHome = async (groupId) => {
  return await KI.get(`/groups/${groupId}/home`);
};

/**
 * 그룹 참여
 * @param {String} groupId
 * @param {String} params.password
 */
export const postGroupsJoin = async (params) => {
  return await KI.post(`/groups/${params[0]}/join`, params[1] && params[1]);
};

/**
 * 자주찾는그룹 순서변경
 * @param {String} params.groupList
 */
export const postGroupsOrds = async (params) => {
  return await KI.post('/groups/ords', params);
};

/**
 * 그룹 리뷰 조회
 * @param {String} params[0] 그룹 아이디
 * @param {String} params[0].pageSize
 * @param {String} params[0].lastReviewId
 * @param {String} params[0].targetMid
 */
export const getGroupsReview = async (params) => {
  return await KI.get(`/groups/${params[0]}/reviews`, params[1]);
};

/**
 * 그룹 일상 조회
 * @param {String} params[0] 그룹 아이디
 * @param {String} params[0].pageSize
 * @param {String} params[0].lastReviewId
 * @param {String} params[0].targetMid
 */
export const getGroupsDaily = async (params) => {
  return await KI.get(`/groups/${params[0]}/daily`, params[1]);
};

/**
 * 그룹 찾기 (통계성)
 * @param {*} params.referralType 통계 키워드 (POPULARITY(인기) , MANYREVIEW(리뷰), RECOM(추천))
 * @param {*} params.category 검색 키워드 (ALL, MEETING, RESTAURANT, HOBBY, REGION)
 */
export const getGroupsStatistics = async (params) => {
  return await KI.get('/groups/statistics', params);
};

/**
 * 그룹 찾기 (전체)
 * @param {*} params.pageSize
 * @param {*} params.lastGroupId
 */
export const getGroupsAll = async (params) => {
  return await KI.get('/groups', params);
};

/**
 * 사용자 프로필 조회
 * @param {*} params.groupId
 * @param {*} params.memberId
 */
export const getGroupsMembers = async (params) => {
  return await KI.get(`/groups/${params.groupId}/members/${params.memberId}`);
};

/**
 * 회원 팔로우
 * @param {*} mid 계정 고유 번호
 */
export const postMembersFollow = async (params) => {
  return await KI.post(
    `/groups/${params.groupId}/members/${params.targetMid}/follow`,
  );
};

/**
 * 회원 신고
 * @param {*} params.reportType
 * @param {*} params.typeId
 */
export const postReport = async ({ reportType, typeId }) => {
  return await KI.post('/report', { reportType, typeId });
};

/**
 * 회원 내보내기
 * @param {*} params.reportType
 * @param {*} params.typeId
 */
export const postGroupsMembersExile = async (params) => {
  return await KI.post(
    `/groups/${params.groupId}/members/${params.targetMid}/exile`,
  );
};

// 그룹 알림 리스트 조회

export const getGroupsAlarmList = async (alarmType) => {
  return await KI.get(`/groups/alarms?alarmType=${alarmType}`);
};

// 그룹 알림 리스트 수정

export const patchGroupsAlarmList = async ({ alarmType, groupId }) => {
  return await KI.patch('/groups/alarms', { alarmType, groupId });
};

// 그룹 팔로우 조회

export const getGroupsFollow = async () => {
  return await KI.get('/groups/follow');
};

// 그룹 팔로우 수정

export const patchGroupsFollow = async ({ groupId, mid }) => {
  return await KI.patch('/groups/follow', { groupId, mid });
};

export const getGroupIsDelete = async ({ groupId }) => {
  return await KI.get(`/groups/${groupId}/is_delete`);
};
