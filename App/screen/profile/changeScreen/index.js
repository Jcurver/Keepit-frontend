import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Image,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Svg from '../../../asset/svg';
import AppHeader from '../../../component/common/appHeader';
import BottomSheetBackdrop from '../../../component/login/customBackdrop';
import AppText from '../../../component/common/appText';
import AppTextInput from '../../../component/common/appTextInput';
import AppTouchable from '../../../component/common/appTouchable';
import BottomSheet from '@gorhom/bottom-sheet';
import MypageSettingTab from '../../../component/mypage/settingTab';
import { colors, images, toSize } from '../../../config/globalStyle';
import MyIcon from '../../../config/icon-font';
import { phoneCheck } from '../../../function/validation';
import RootNavigation from '../../../RootNavigation';
import BackgroundTimer from 'react-native-background-timer';
import Screen from '../../Screen';
import InvitationView from '../../../component/group/invitationView';
import CertificationView from '../../../component/login/certificationView';
import { startTimer } from '../../../function/time';
import { callApi, changePhoneNum, encryptData } from '../../../function/auth';
import { postAuthSms } from '../../../api/user';
import updateSameText from '../../../function/updateSameText';
import { patchMypagePhone } from '../../../api/myPage';

const ProfileChangeScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  const [certificationNum, setCertificationNum] = useState('');
  const [warningMessage, setWarningMessage] = useState();
  const [timer, setTimer] = useState(0);
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [toastText, setToastText] = useState();
  const ref = useRef();
  const bottomSheetRef = useRef();

  const timeLimit = 180;

  useEffect(() => {
    ref?.current?.focus();
  }, []);

  useEffect(() => {
    if (timer === timeLimit) {
      BackgroundTimer.stopBackgroundTimer();
    }
  }, [timer]);

  // variables
  const snapPoints = [toSize(1), toSize(300)];

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

  const handleSheet = useCallback((index) => {
    bottomSheetRef.current.snapToIndex(index);
  }, []);

  const handleSheetChanges = (index) => {
    if (index < 1) {
      Keyboard.dismiss();
    }
  };

  const handleRequestNumber = (apiData) => {
    postAuthSms(apiData).then((res) => {
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
      }
    });
  };

  const handleChange = (res) => {
    setIsApiLoading(false);
    if (res.data.apiStatus.apiCode === 200) {
      RootNavigation.navigate('ProfileAccountScreen', {
        phone: phoneNumber.replaceAll('-', ''),
      });
    }
  };

  return (
    <Screen type={'view'} toastText={toastText}>
      <AppHeader
        leftIcon={<MyIcon name={'ic_close'} size={toSize(14)} />}
        leftIconPress={() => RootNavigation.goBack()}
      />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <AppText size={24} weight={'bold'}>
            휴대폰 번호 변경
          </AppText>

          <AppTextInput
            inputRef={ref}
            boxStyle={styles.phoneBox}
            placeholder={'바뀐 휴대폰 번호를 입력해 주세요.'}
            value={phoneNumber}
            onChangeText={(text) => {
              const num = text.replaceAll('-', '');
              setPhoneNumber(changePhoneNum(num));
            }}
            maxLength={13}
            keyboardType={'number-pad'}
          />

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
                  authType: 'CHANGE_PHONE',
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
        </View>
      </TouchableWithoutFeedback>

      <BottomSheet
        ref={bottomSheetRef}
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
            setKeyboardFocus(false);
            if (timer === 180) {
              BackgroundTimer.stopBackgroundTimer();
              const apiData = {
                authType: 'CHANGE_PHONE',
                phone: encryptData(phoneNumber.replaceAll('-', '')),
              };
              handleRequestNumber(apiData);
            } else {
              callApi(
                patchMypagePhone,
                {
                  phone: encryptData(phoneNumber.replaceAll('-', '')),
                  authNum: certificationNum,
                },
                handleChange,
              );
            }
          }}
        />
      </BottomSheet>
    </Screen>
  );
};

export default ProfileChangeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: toSize(16),
    paddingHorizontal: toSize(16),
  },
  phoneBox: {
    marginTop: toSize(24),
    marginBottom: toSize(20),
  },
  messageButton: {
    marginBottom: toSize(24),
    backgroundColor: colors.ColorC4C4C4,
  },
});
