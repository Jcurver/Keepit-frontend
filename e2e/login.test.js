/* eslint-disable no-undef */
describe('login logic', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('login stream', async () => {
    await expect(element(by.text('우리들만의 장소를 모으다'))).toBeVisible();
    await element(by.text('시작하기')).tap();
    await expect(element(by.text('휴대폰 번호로 가입'))).toBeVisible();
    await expect(element(by.text('로그인하기'))).toBeVisible();
    await element(by.id('dologin')).tap();
    await expect(element(by.text('휴대폰 번호로 로그인'))).toBeVisible();
    await element(by.id('login-input')).typeText('01000000000');
    await element(by.text('문자 인증번호 받기')).tap();
    await expect(element(by.text('문자 인증번호 입력'))).toBeVisible();
    await element(by.id('BottomSheetTextInput')).typeText('134679');
    await element(by.text('확인')).tap();
    await expect(element(by.text('자주 찾는 그룹'))).toBeVisible();
  });
});
