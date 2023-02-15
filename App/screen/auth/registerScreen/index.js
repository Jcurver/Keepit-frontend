import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, TouchableWithoutFeedback, Keyboard, Image } from 'react-native';
import { get } from 'lodash';
import AppText from '../../../component/common/appText';
import AppTouchable from '../../../component/common/appTouchable';
import AppTextInput from '../../../component/common/appTextInput';
import { colors, toSize } from '../../../config/globalStyle';
import BottomSheet from '@gorhom/bottom-sheet';
import Screen from '../../Screen';
import { styles } from './styles';
import AppModal from '../../../component/common/appModal';
import BackgroundTimer from 'react-native-background-timer';
import { startTimer } from '../../../function/time';
import CertificationView from '../../../component/login/certificationView';
import BottomSheetBackdrop from '../../../component/login/customBackdrop';
import TermView from '../../../component/login/termView';
import RootNavigation from '../../../RootNavigation';
import { phoneCheck } from '../../../function/validation';
import { postAuthSms, postAuthSmsSignup } from '../../../api/user';
import { useDispatch, useSelector } from 'react-redux';
import { setPhone } from '../../../store/feature/userSlice';
import { changePhoneNum, encryptData } from '../../../function/auth';
import updateSameText from '../../../function/updateSameText';
import { setFcmToken } from '../../../store/feature/deviceSlice';
import messaging from '@react-native-firebase/messaging';

const RegisterScreen = ({ route }) => {
  const previousPhoneNumber = get(route, 'params.phoneNumber');
  const [timer, setTimer] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [visible, setvisible] = useState(false);
  const [loginVisible, setLoginVisible] = useState(false);
  const [certificationNum, setCertificationNum] = useState('');
  const [isCertification, setIsCertification] = useState(true);
  const [isTerm, setIsTerm] = useState(false);
  const [sheetHeight, setSheetHeight] = useState(toSize(310));
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  const [warningMessage, setWarningMessage] = useState();
  const [toastText, setToastText] = useState();
  const [isApiLoading, setIsApiLoading] = useState(false);
  const fcmToken = useSelector((state) => state.device.fcmToken);
  const dispatch = useDispatch();

  const timeLimit = 180;

  // ref
  const ref = useRef(null);

  // variables
  const snapPoints = [toSize(1), sheetHeight];

  // callbacks
  const handleSheet = useCallback((index) => {
    ref.current.snapToIndex(index);
  }, []);
  useEffect(() => {
    if (!fcmToken) {
      const getToken = async () => {
        const myFcmToken = await messaging().getToken();
        dispatch(setFcmToken(myFcmToken));
      };
      getToken();
    }
  }, [dispatch, fcmToken]);

  // useEffect(() => {
  //   setPhoneNumber(changePhoneNum(phoneNumber));
  // }, [phoneNumber]);

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
      BackgroundTimer.stopBackgroundTimer();
      setWarningMessage();
      setSheetHeight(toSize(305));
      setIsCertification(true);
      setIsTerm(false);
      setCertificationNum('');
      setKeyboardFocus(false);
    }
  };

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        opacity={0.6}
        onPress={() => Keyboard.dismiss()}
        pressBehavior={isTerm ? 'none' : 'close'}
      />
    ),
    [isTerm],
  );

  const handleRequestNumber = (phone, apiData) => {
    postAuthSms(phone, apiData).then((res) => {
      setIsApiLoading(false);
      if (res.data.apiStatus.apiCode === 200) {
        handleSheet(1);
        setKeyboardFocus(true);
        setWarningMessage();
        setCertificationNum('');
        setTimer(0);
        startTimer(setTimer);
        setToastText((text) =>
          updateSameText('인증번호가 문자로 전송됐습니다.', text),
        );
      } else if (res.data.apiStatus.apiCode === 702) {
        setLoginVisible(true);
      }
    });
  };

  const handleCheckNumber = (phone, authNum) => {
    const apiData = { phone: encryptData(phone), authNum };
    postAuthSmsSignup(apiData).then((res) => {
      setIsApiLoading(false);
      if (res.data.apiStatus.apiCode === 200) {
        BackgroundTimer.stopBackgroundTimer();
        setSheetHeight(toSize(461));
        setWarningMessage();
        setIsCertification(false);
        setCertificationNum('');
        setKeyboardFocus(false);
        setIsTerm(true);
      } else {
        setWarningMessage('인증번호를 다시 입력하세요');
      }
    });
  };

  return (
    <Screen toastMargin toastText={toastText} topSafeArea={false} type={'view'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <AppText size={24} weight={'bold'} testID="dddd">
            휴대폰 번호로 가입
          </AppText>

          <AppTextInput
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
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <AppText
              style={styles.confirm}
              color={colors.Color6B6A6A}
              letterSpacing={0.4}
            >
              {'이미 계정이 있나요? '}
            </AppText>

            <AppText
              testID={'dologin'}
              accessibilityLabel="dologin"
              onPress={() => {
                RootNavigation.navigate('LoginScreen');
              }}
              style={styles.login}
              color={colors.Color6B6A6A}
              letterSpacing={0.4}
            >
              로그인하기
            </AppText>
          </View>

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
                  authType: 'SIGN_UP',
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
            SNS로 가입
          </AppText> */}

          {/* <AppTouchable
            button
            style={styles.kakaoButton}
            onPress={() => setvisible(true)}
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
      </TouchableWithoutFeedback>

      <AppModal
        visible={loginVisible}
        title={'이미 가입되어 있는 번호에요.'}
        leftButtonText={'취소'}
        onPressLeft={() => setLoginVisible(false)}
        rightButtonText={'로그인 하러가기'}
        onPressRight={() => {
          setLoginVisible(false);
          BackgroundTimer.stopBackgroundTimer();
          ref.current.close();
          RootNavigation.navigate('LoginScreen', {
            phoneNumber: phoneNumber.replaceAll('-', ''),
          });
        }}
      />

      <AppModal
        visible={visible}
        title={'아직 준비중입니다.'}
        rightButtonText={'확인'}
        onPressRight={() => setvisible(false)}
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
        {isCertification && (
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
                // ref.current.close();
                // API 연동하면서 수정 예정
                if (timer === 180) {
                  BackgroundTimer.stopBackgroundTimer();
                  const apiData = {
                    authType: 'SIGN_UP',
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
        )}
        {isTerm && (
          <TermView
            onPressClose={() => ref.current.close()}
            onPress={() => {
              dispatch(setPhone(phoneNumber.replaceAll('-', '')));
              setSheetHeight(toSize(305));
              setIsCertification(true);
              setCertificationNum('');
              setKeyboardFocus(false);
              setIsTerm(false);
              ref.current.close();
              RootNavigation.navigate('ProfileScreen');
            }}
          />
        )}
      </BottomSheet>
    </Screen>
  );
};

export default RegisterScreen;
