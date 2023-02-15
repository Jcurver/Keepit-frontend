import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, TouchableWithoutFeedback, Keyboard, Image } from 'react-native';
import { get } from 'lodash';
import AppText from '../../../component/common/appText';
import AppTouchable from '../../../component/common/appTouchable';
import AppTextInput from '../../../component/common/appTextInput';
import { colors, toSize } from '../../../config/globalStyle';
import BackgroundTimer from 'react-native-background-timer';
import BottomSheetBackdrop from '../../../component/login/customBackdrop';
import BottomSheet from '@gorhom/bottom-sheet';
import Screen from '../../Screen';
import { styles } from './styles';
import AppModal from '../../../component/common/appModal';
import CertificationView from '../../../component/login/certificationView';
import RootNavigation from '../../../RootNavigation'; // 스와이프 테스트 및 joinScreen 제작 후 삭제
import {
  postAuthSms,
  postAuthSmsSignin,
  putMembersFcmToken,
} from '../../../api/user';
import { setAuthInfo } from '../../../store/feature/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { phoneCheck } from '../../../function/validation';
import jwt_decode from 'jwt-decode';
import Svg from '../../../asset/svg';
import { changePhoneNum, encryptData } from '../../../function/auth';
import updateSameText from '../../../function/updateSameText';
import useInterval from '../../../hook/useInterval';

const LoginScreen = ({ route }) => {
  const previousPhoneNumber = get(route, 'params.phoneNumber');
  const [timer, setTimer] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [visible, setvisible] = useState(false);
  const [registerVisible, setRegisterVisible] = useState(false);
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  const [warningMessage, setWarningMessage] = useState();
  const [certificationNum, setCertificationNum] = useState('');
  const [toastText, setToastText] = useState();
  const [isApiLoading, setIsApiLoading] = useState(false);
  const dispatch = useDispatch();
  const fcmToken = useSelector((state) => state.device.fcmToken);

  useInterval(() => {
    setTimer((t) => {
      if (t < 180) {
        return t + 1;
      } else {
        return t;
      }
    });
  }, 1000);
  const timeLimit = 180;
  // ref
  const ref = useRef(null);

  // variables
  const snapPoints = [toSize(1), toSize(305)];

  // callbacks
  const handleSheet = useCallback((index) => {
    ref.current.snapToIndex(index);
  }, []);

  useEffect(() => {
    if (previousPhoneNumber) {
      setPhoneNumber(changePhoneNum(previousPhoneNumber));
    }
  }, [previousPhoneNumber]);

  useEffect(() => {
    if (timer === timeLimit) {
      BackgroundTimer.stopBackgroundTimer();
    }
  }, [timer]);

  const handleSheetChanges = (index) => {
    if (index < 1) {
      Keyboard.dismiss();
    }
  };

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        opacity={0.6}
        onPress={() => Keyboard.dismiss()}
      />
    ),
    [],
  );

  const handleRequestNumber = (apiData) => {
    postAuthSms(apiData).then((res) => {
      setIsApiLoading(false);
      if (res.data.apiStatus.apiCode === 200) {
        handleSheet(1);
        setKeyboardFocus(true);
        setWarningMessage();
        setCertificationNum('');
        setTimer(0);
        // startTimer(setTimer);
        setToastText((text) =>
          updateSameText('인증번호가 문자로 전송됐습니다.', text),
        );
      } else if (res.data.apiStatus.apiCode === 700) {
        setRegisterVisible(true);
      }
    });
  };

  const handleCheckNumber = (phone, authNum) => {
    const apiData = { phone: encryptData(phone), authNum };
    postAuthSmsSignin(apiData).then(async (res) => {
      setIsApiLoading(false);
      if (res.data.apiStatus.apiCode === 200) {
        BackgroundTimer.stopBackgroundTimer();
        const authTokens = res.data.data;
        const { sub } = await jwt_decode(authTokens.accessToken);
        const authInfo = Object.assign(authTokens, { MID: sub });
        dispatch(setAuthInfo(authInfo));
        putMembersFcmToken(fcmToken);
        RootNavigation.reset([{ name: 'Main' }]);
      } else if (res.data.apiStatus.apiCode === 700) {
        setRegisterVisible(true);
      } else {
        setWarningMessage('인증번호를 다시 입력하세요');
      }
    });
  };

  return (
    <Screen toastMargin toastText={toastText} topSafeArea={false}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <>
          <AppTouchable
            style={styles.back}
            onPress={() => RootNavigation.goBack()}
          >
            {Svg('back_thin')}
          </AppTouchable>
          <View style={styles.container}>
            <AppText
              size={24}
              weight={'bold'}
              style={{ marginTop: toSize(14) }}
            >
              휴대폰 번호로 로그인
            </AppText>
            <AppTextInput
              testID="login-input"
              boxStyle={{ marginTop: toSize(24) }}
              placeholder={'휴대폰 번호를 입력해 주세요.'}
              value={phoneNumber}
              onChangeText={(text) => {
                const num = text.replaceAll('-', '');
                setPhoneNumber(changePhoneNum(num));
              }}
              maxLength={13}
              keyboardType={'number-pad'}
            />

            <AppText
              style={styles.confirm}
              color={colors.Color6B6A6A}
              letterSpacing={0.4}
            >
              {'휴대폰 번호가 변경됐어요. '}
              <AppText
                style={styles.login}
                color={colors.Color6B6A6A}
                letterSpacing={0.4}
                onPress={() => {
                  RootNavigation.navigate('NumChangeScreen');
                }}
              >
                고객센터 문의
              </AppText>
            </AppText>

            <AppTouchable
              button
              style={[
                styles.messageButton,
                phoneCheck(phoneNumber.replaceAll('-', '')) && {
                  backgroundColor: colors.primary,
                },
              ]}
              disabled={!phoneCheck(phoneNumber.replaceAll('-', ''))}
              onPress={() => {
                Keyboard.dismiss();
                if (!isApiLoading) {
                  setIsApiLoading(true);
                  const apiData = {
                    authType: 'SIGN_IN',
                    phone: encryptData(phoneNumber.replaceAll('-', '')),
                  };
                  handleRequestNumber(apiData);
                }
              }}
            >
              <AppText weight={'bold'} size={18} color={colors.white}>
                문자 인증번호 받기
              </AppText>
            </AppTouchable>

            {/* <View style={globalStyle.seperater} /> */}

            {/* <AppText
              style={styles.guide}
              color={colors.Color6B6A6A}
              letterSpacing={0.4}
            >
              SNS로 로그인
            </AppText> */}

            {/* <AppTouchable
              button
              style={styles.kakaoButton}
              onPress={() => {
                setvisible(true);
              }}
            >
              <View style={globalStyle.flexRowCenter}>
                <Image source={images.kakaoLogo} />
                <AppText
                  style={{ marginLeft: toSize(10) }}
                  size={16}
                  color={colors.Color675C5C}
                >
                  카카오로 시작하기
                </AppText>
              </View>
            </AppTouchable>

            <AppTouchable
              button
              style={styles.googleButton}
              onPress={() => setvisible(true)}
            >
              <View style={globalStyle.flexRowCenter}>
                <Image source={images.googleLogo} />
                <AppText
                  style={{ marginLeft: toSize(10) }}
                  size={16}
                  color={colors.Color675C5C}
                >
                  Google로 시작하기
                </AppText>
              </View>
            </AppTouchable> */}
          </View>
        </>
      </TouchableWithoutFeedback>

      <AppModal
        visible={visible}
        title={'아직 준비중입니다.'}
        rightButtonText={'확인'}
        onPressRight={() => setvisible(false)}
      />

      <AppModal
        visible={registerVisible}
        title={'가입된 정보가 없어요.\n회원 가입을 진행해 주세요'}
        rightButtonText={'회원가입 하러가기'}
        onPressRight={() => {
          setRegisterVisible(false);
          BackgroundTimer.stopBackgroundTimer();
          ref.current.close();
          RootNavigation.navigate('RegisterScreen', {
            phoneNumber: phoneNumber.replaceAll('-', ''),
          });
        }}
      />
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backgroundStyle={{ borderRadius: 30 }}
        backdropComponent={renderBackdrop}
        keyboardBlurBehavior={'restore'}
        onChange={handleSheetChanges}
      >
        <CertificationView
          focus={keyboardFocus}
          timer={timer}
          value={certificationNum}
          onChangeText={(texts) => setCertificationNum(texts)}
          warningMessage={warningMessage}
          onPress={() => {
            Keyboard.dismiss();
            if (!isApiLoading) {
              setIsApiLoading(true);
              setKeyboardFocus(false);
              if (timer === 180) {
                BackgroundTimer.stopBackgroundTimer();
                const apiData = {
                  authType: 'SIGN_IN',
                  phone: encryptData(phoneNumber.replaceAll('-', '')),
                };
                handleRequestNumber(apiData);
              } else {
                handleCheckNumber(
                  phoneNumber.replaceAll('-', ''),
                  certificationNum,
                );
              }
            }
          }}
        />
      </BottomSheet>
    </Screen>
  );
};

export default LoginScreen;
