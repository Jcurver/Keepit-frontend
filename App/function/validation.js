export const phoneRegexp = /^01(?:0|1|[6-9])(?:\d{3}|\d{4})\d{4}$/;
export const birthdayRegexp =
  /(\d{2}(0[1-9]{1}|1[0-2]{1})(0[1-9]{1}|[1|2]\d{1}|3[0|1]))/;
export const genderRegexp = /([1-4]{1})/;
export const emailRegexp = /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
export const nameRegexp = /^([-_A-Za-z0-9ㄱ-ㅎ가-힣\\.]){2,20}$/;
export const groupPasswordRegexp = /^[a-zA-Z0-9]{4,8}$/;

export const lengthCheck = (content) => {
  return (content.match(/[\n]/g) || []).length + 1;
};

export const phoneCheck = (input) => {
  return phoneRegexp.test(input);
};

export const birthdayValidation = (input) => {
  return birthdayRegexp.test(input);
};

export const emailCheck = (input) => {
  return emailRegexp.test(input);
};

export const nameCheck = (input) => {
  return nameRegexp.test(input);
};

export const groupPasswordCheck = (input) => {
  return groupPasswordRegexp.test(input);
};

/**
 * 숫자로 이루어진 전화번호를 형식에 맞게 대시(-)를 추가해서 반환
 * @param {Number} phone
 */
export const phoneWithDash = (phone) => {
  return phone
    .replace(
      /(^(01[1|6|7|8|9|0])|^02|^0505|^(0(2[1|6|7|8|9]|3[1-3]|4[1-4]|5[0-5]|6[1-4]|70)))/g,
      '$1-',
    )
    .replace(/(\d{4}$)/, '-$1');
};
