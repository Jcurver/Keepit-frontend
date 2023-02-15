import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AppHeader from '../../../component/common/appHeader';
import AppText from '../../../component/common/appText';
import AppTextArea from '../../../component/common/appTextArea';
import AppTextInput from '../../../component/common/appTextInput';
import AppTouchable from '../../../component/common/appTouchable';
import { colors, toSize } from '../../../config/globalStyle';
import RootNavigation from '../../../RootNavigation';
import Screen from '../../Screen';
import Svg from '../../../asset/svg';
import { emailCheck } from '../../../function/validation';
import { postMypageInquiry } from '../../../api/myPage';
import { callApi } from '../../../function/auth';

const ProfileServiceScreen = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [content, setContent] = useState('');
  const [contentError, setContentError] = useState(false);
  const [complete, setComplete] = useState(false);

  const handleSubmit = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      setComplete(true);
    }
  };

  return (
    <Screen>
      {complete ? (
        <>
          <View style={styles.confirmContainer}>
            <View style={styles.checkContainer}>{Svg('ic_check')}</View>
            <AppText size={20} weight={'medium'}>
              문의가 접수 되었습니다.
            </AppText>
            <AppText
              size={16}
              color={colors.Color6B6A6A}
              style={styles.message}
            >
              {
                '문의하신 내용을 확인 후\n최대한 빠른 시일 내로 답변드리겠습니다.'
              }
            </AppText>
          </View>
          <AppTouchable
            button
            style={styles.queryButton}
            onPress={() => {
              RootNavigation.goBack();
            }}
          >
            <AppText size={16} weight={'bold'} color={colors.white}>
              확인
            </AppText>
          </AppTouchable>
        </>
      ) : (
        <>
          <AppHeader
            title={'고객센터'}
            leftIcon={Svg('ic_backBtn')}
            leftIconPress={() => RootNavigation.goBack()}
          />
          <KeyboardAwareScrollView
            extraScrollHeight={toSize(30)}
            keyboardShouldPersistTaps={'handled'}
          >
            <View style={{ flex: 1 }}>
              <View style={styles.container}>
                <AppText size={24} weight={'bold'}>
                  궁금한 점이 있으세요?
                </AppText>
                <AppText
                  style={{ marginTop: toSize(24) }}
                  size={16}
                  weight={'bold'}
                >
                  고객센터 상담 시간
                </AppText>
                <AppText style={styles.time} size={16}>
                  평일 10:00 ~ 17:00 (주말, 공휴일 휴무)
                </AppText>

                <AppText>* 답변 받을 이메일 주소</AppText>

                <AppTextInput
                  boxStyle={[styles.emailBox, emailError && styles.errorBox]}
                  size={16}
                  placeholder={'Value@gmail.com'}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (emailCheck(email)) {
                      setEmailError(false);
                    }
                  }}
                  keyboardType={'email-address'}
                  onBlur={() => {
                    if (!emailCheck(email)) {
                      setEmailError(true);
                    } else {
                      setEmailError(false);
                    }
                  }}
                />

                <View style={styles.error}>
                  {emailError && (
                    <AppText size={11} color={colors.ColorF0102B}>
                      올바른 이메일 주소를 입력해주세요.
                    </AppText>
                  )}
                </View>

                <AppText>* 문의 내용</AppText>

                <AppTextArea
                  style={[styles.contentBox, contentError && styles.errorBox]}
                  textStyle={{ fontSize: toSize(16) }}
                  placeholder={'문의 내용을 입력해주세요.'}
                  keyboardType={'default'}
                  maximumInput={1000}
                  value={content}
                  onChangeText={(text) => {
                    setContent(text);
                    if (text.length > 1) {
                      setContentError(false);
                    }
                  }}
                  onBlur={() => {
                    if (content?.length < 2) {
                      setContentError(true);
                    } else {
                      setContentError(false);
                    }
                  }}
                />

                <View style={styles.error}>
                  {contentError && (
                    <AppText size={11} color={colors.ColorF0102B}>
                      {content?.length === 1
                        ? '최소 2자 이상 입력해야 합니다'
                        : '필수 입력 항목입니다.'}
                    </AppText>
                  )}
                </View>
              </View>
            </View>
          </KeyboardAwareScrollView>
          <AppTouchable
            button
            style={[
              styles.queryButton,
              (isEmpty(email) ||
                isEmpty(content) ||
                emailError ||
                contentError) && {
                backgroundColor: colors.ColorC4C4C4,
              },
            ]}
            disabled={
              isEmpty(email) || isEmpty(content) || emailError || contentError
            }
            onPress={() => {
              callApi(
                postMypageInquiry,
                { email, detail: content },
                handleSubmit,
              );
            }}
          >
            <AppText size={16} weight={'bold'} color={colors.white}>
              문의하기
            </AppText>
          </AppTouchable>
        </>
      )}
    </Screen>
  );
};

export default ProfileServiceScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: toSize(16),
    paddingTop: toSize(48),
  },
  time: {
    marginTop: toSize(4),
    marginBottom: toSize(32),
  },
  emailBox: {
    marginTop: toSize(4),
    marginBottom: toSize(4),
  },
  contentBox: {
    marginTop: toSize(8),
    marginBottom: toSize(4),
    height: toSize(180),
  },
  error: {
    height: toSize(32),
  },
  queryButton: {
    height: toSize(48),
    marginHorizontal: toSize(16),
    marginBottom: toSize(12),
    backgroundColor: colors.primary,
  },
  confirmContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkContainer: {
    width: toSize(66),
    height: toSize(66),
    borderRadius: 999,
    backgroundColor: colors.ColorF0FFF9,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: toSize(36),
  },
  message: {
    textAlign: 'center',
    marginTop: toSize(12),
  },
  errorBox: {
    // borderWidth: 1,
    // borderColor: 'red',
  },
});
