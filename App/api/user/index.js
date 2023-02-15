import { KI } from 'api/index.js';
import { encryptData } from '../../function/auth';

/**
 * SMS 인증번호 요청
 * @param {*} phone 핸드폰 번호
 * @param {*} apiData.authType sign-up / sign-in
 * @param {*} apiData.phone 암호화된 휴대폰 번호
 */
export const postAuthSms = async (apiData) => {
  return await KI.post('/auth/sms', apiData);
};

/**
 * SMS 회원가입 인증번호 확인
 * @param {*} apiData.phone 핸드폰 번호
 * @param {*} apiData.authNum 인증번호
 */
export const postAuthSmsSignup = async (apiData) => {
  return await KI.post('/auth/sms/sign-up', apiData);
};

/**
 * SMS 회원가입 인증번호 확인
 * @param {*} apiData.phone 핸드폰 번호
 * @param {*} apiData.authNum 인증번호
 */
export const postAuthSmsSignin = async (apiData) => {
  return await KI.post('/auth/sms/sign-in', apiData);
};

/**
 * 회원가입
 * @param {*} apiData.terms.terms 이용약관 동의
 * @param {*} apiData.terms.terms 정보수집 동의
 * @param {*} apiData.terms.terms 마케팅 동의
 * @param {*} apiData.terms.terms 알람 동의
 * @param {*} apiData.members.name 이름
 * @param {*} apiData.members.phone 번호
 * @param {*} apiData.members.profileUrl 프로필 url
 * @param {*} apiData.members.pinProfileUrl 핀 프로필 url
 * @param {*} apiData.members.fcmToken
 */
export const postMembersSignup = async (apiData) => {
  return await KI.post('/members/sign-up', apiData);
};

/**
 * 이름 중복 체크
 * @param {*} apiData.name 이름
 * @param {*} apiData.email 답변받을 이메일
 * @param {*} apiData.place 최근 작성한 장소
 * @param {*} apiData.world 속한 그룹 이름
 * @param {*} apiData.etc 기타
 */
export const postMembersInquiry = async (apiData) => {
  return await KI.post('/members/inquiry', apiData);
};

/**
 * 이름 중복 체크
 * @param {*} name 이름
 */
export const getMembersExists = async (name) => {
  return await KI.get(`/members/${name}/exists`);
};

/**
 * 로그아웃
 */
export const postMembersLogout = async () => {
  return await KI.post('/members/logout');
};

/**
 * 회원탈퇴
 */
export const postMembersWithdrawal = async () => {
  return await KI.post('/members/withdrawal');
};

/**
 * 회원차단
 */
export const postMembersBlock = async (params) => {
  return await KI.post(`/members/${params.targetMid}/block`, {
    groupId: params.groupId ? params.groupId : undefined,
  });
};

// FCM 토큰 업데이트

export const putMembersFcmToken = async (fcmToken) => {
  return await KI.put(`/members/fcm?fcmToken=${fcmToken}`);
};

// 알람 토글 가져오기

export const getMembersAlarms = async () => {
  return await KI.get('/members/alarms');
};

// 알람 토글 업데이트

export const patchMembersAlarms = async (settings) => {
  return await KI.patch('/members/alarms', settings);
};

export const patchMembersTerms = async (terms) => {
  return await KI.patch('/members/terms', terms);
};
