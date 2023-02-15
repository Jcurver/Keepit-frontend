import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
  ActionSheetIOS,
  Alert,
  Animated,
} from 'react-native';
import AppText from '../../../component/common/appText';
import AppTouchable from '../../../component/common/appTouchable';
import {
  colors,
  toSize,
  images,
  screenHeight,
} from '../../../config/globalStyle';
import RootNavigation from '../../../RootNavigation';
import Screen from '../../Screen';
import AppHeader from '../../../component/common/appHeader';
import ProfileImage from '../../../component/image/profileImage';
import AppTextInput from '../../../component/common/appTextInput';
import Permissions, { PERMISSIONS } from 'react-native-permissions';
import ImagePicker from 'react-native-image-crop-picker';
import AppLoading from '../../../component/common/appLoading';
import SettingLinking from '../../../component/common/settingLinking';
import { getMembersExists, postMembersSignup } from '../../../api/user';
import { useDispatch, useSelector } from 'react-redux';
import {
  setAuthInfo,
  setTempProfileImage,
} from '../../../store/feature/userSlice';
import { nameCheck } from '../../../function/validation';
import Config from 'react-native-config';
import jwt_decode from 'jwt-decode';
import { get } from 'lodash';
import Svg from '../../../asset/svg';
import { postImageServer } from '../../../function/image';
import { callApi, encryptData } from '../../../function/auth';
import { patchMembers } from '../../../api/myPage';

const ProfileScreen = ({ route }) => {
  const fromProfile = get(route, 'params.fromProfile');
  const profileUrl = get(route, 'params.profileUrl');
  const name = get(route, 'params.name');
  const [image, setImage] = useState(null);
  const [previousImage, setPreviousImage] = useState(null);
  const [nickName, setNickName] = useState(null);
  const [warningMessage, setWarningMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);
  const phone = useSelector((state) => state.user.phone);
  const terms = useSelector((state) => state.user.terms);
  const dispatch = useDispatch();

  useEffect(() => {
    if (fromProfile) {
      setPreviousImage(profileUrl);
      setNickName(name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (complete) {
      start();
      setTimeout(() => {
        RootNavigation.reset([{ name: 'FunctionScreen' }]);
      }, 2000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [complete]);

  const opacityValue = useRef(new Animated.Value(0)).current;
  const animValue = useRef(new Animated.Value(0)).current;

  const opacityStyle = opacityValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const start = () => {
    Animated.timing(animValue, {
      useNativeDriver: true,
      toValue: -toSize(50),
      duration: 300,
    }).start();

    Animated.timing(opacityValue, {
      useNativeDriver: true,
      toValue: 1,
    }).start();
  };

  const options = ['닫기', '앨범에서 선택', '프로필 사진 삭제'];
  const fcmToken = useSelector((state) => state.device.fcmToken);

  const handleOpenGallery = () => {
    Permissions.request(PERMISSIONS.IOS.PHOTO_LIBRARY).then((res) => {
      if (res === 'granted' || res === 'limited') {
        ImagePicker.openPicker({
          compressImageQuality: 0.8,
          mediaType: 'photo',
          includeExif: true,
          multiple: false,
          maxFiles: 1,
          forceJpg: true,
          compressImageMaxWidth: 1300,
        })
          .then((pics) => {
            console.log(pics);
            setPreviousImage(null);
            setImage({
              uri: 'file://' + pics.path,
              type: pics.mime,
              name: 'image.jpeg',
            });
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        SettingLinking({ title: '사진첩' });
      }
    });
  };

  const onPress = () =>
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: options,
        // title: 'Are you sure you want to do this?',
        destructiveButtonIndex: 2,
        cancelButtonIndex: 0,
        userInterfaceStyle: 'light',
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          console.log('cancel');
        } else if (buttonIndex === 1) {
          handleOpenGallery();
        } else if (buttonIndex === 2) {
          setImage(null);
          setPreviousImage(null);
        }
      },
    );

  const handleNameCheck = (myName) => {
    setLoading(true);
    if (name && name === myName) {
      //patch
      if (image) {
        handleSignupWithProfile();
      } else {
        callApi(
          patchMembers,
          { name: nickName, profileUrl: previousImage ? previousImage : null },
          handlePatch,
        );
      }
    } else {
      getMembersExists(myName).then((res) => {
        if (res.data.apiStatus.apiCode === 200) {
          if (image) {
            handleSignupWithProfile();
          } else {
            if (fromProfile) {
              callApi(
                patchMembers,
                {
                  name: nickName,
                  profileUrl: previousImage ? previousImage : null,
                },
                handlePatch,
              );
            } else {
              handleSignup();
            }
          }
        } else if (res.data.apiStatus.apiCode === 600) {
          setWarningMessage('이미 사용중인 이름입니다.');
          setLoading(false);
        } else if (res.data.apiStatus.apiCode === 995) {
          setWarningMessage('사용할 수 없는 닉네임입니다.');
          setLoading(false);
        } else {
          setLoading(false);
        }
      });
    }
  };

  const handleSignupWithProfile = async () => {
    postImageServer(image, 'profile').then((res) => {
      if (res) {
        if (fromProfile) {
          callApi(
            patchMembers,
            { name: nickName, profileUrl: res.data },
            handlePatch,
          );
        } else {
          handleSignup(res.data);
        }
      }
    });
  };

  const handleSignup = (imageData) => {
    const apiData = {
      member: {
        name: nickName,
        phone: encryptData(phone),
        profileUrl: imageData ? imageData : undefined,
        fcmToken,
      },
      terms,
    };
    postMembersSignup(apiData).then(async (res) => {
      if (res.data.apiStatus.apiCode === 201) {
        // 회원가입시 MID 넣는 로직입니다.
        const authTokens = res.data.data;
        const { sub } = await jwt_decode(authTokens.accessToken);
        const authInfo = Object.assign(authTokens, { MID: sub });
        dispatch(setAuthInfo(authInfo));
        setLoading(false);
        // 여기 수정
        // RootNavigation.reset([{ name: 'FunctionScreen' }]);
        setComplete(true);
      } else {
        setLoading(false);
      }
    });
  };

  const handlePatch = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      RootNavigation.goBack();
    }
  };

  return (
    <Screen type={complete ? 'view' : 'safe'} topSafeArea={complete && false}>
      {complete ? (
        <View style={styles.completeContainer}>
          <Image
            source={images.signup_complete}
            style={{
              marginBottom: toSize(42),
              width: toSize(206),
              height: toSize(214),
            }}
          />
          <Animated.View
            style={[
              { opacity: opacityStyle, transform: [{ translateY: animValue }] },
              styles.completeView,
            ]}
          >
            <AppText
              color={'white'}
              weight={'bold'}
              size={24}
              style={{ marginBottom: toSize(8) }}
            >
              킵잇에 오신걸 환영해요!
            </AppText>
            <AppText size={16} color={'white'}>
              가입완료.
            </AppText>
          </Animated.View>
        </View>
      ) : (
        <>
          <AppHeader
            leftIcon={fromProfile ? Svg('ic_back') : Svg('close_thin')}
            leftIconPress={() => RootNavigation.goBack()}
            title={fromProfile ? '내 정보 수정' : '프로필 설정'}
          />
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
              <ProfileImage
                data={previousImage ? previousImage : image}
                style={styles.profile}
                badge
                onPress={onPress}
              />
              <AppTextInput
                textAlign={'center'}
                style={styles.input}
                boxStyle={warningMessage ? styles.warning : styles.notWarning}
                placeholder={'사용자 닉네임을 입력해 주세요.'}
                value={nickName}
                onChangeText={(text) => {
                  if (warningMessage) {
                    setWarningMessage(null);
                  }
                  setNickName(text);
                }}
                maxLength={20}
                onBlur={() => {
                  if (nickName?.length < 2) {
                    setWarningMessage('사용자 이름은 2자 이상 입력해주세요.');
                  } else if (!nameCheck(nickName)) {
                    setWarningMessage(
                      '사용자 이름에는 한글, 영문자, 숫자, 밑줄 및 마침표만 사용 가능합니다',
                    );
                  }
                }}
              />
              {warningMessage && (
                <AppText size={11} color={colors.ColorEC0000}>
                  {warningMessage}
                </AppText>
              )}
              <AppTouchable
                button
                style={[
                  styles.confirm,
                  nickName?.length > 1 &&
                    !warningMessage && { backgroundColor: colors.primary },
                ]}
                disabled={!(nickName?.length > 1) || warningMessage}
                onPress={() => {
                  if (nickName?.length < 2) {
                    setWarningMessage('사용자 이름은 2자 이상 입력해주세요.');
                  } else if (!nameCheck(nickName)) {
                    setWarningMessage(
                      '사용자 이름에는 한글, 영문자, 숫자, 밑줄 및 마침표만 사용 가능합니다',
                    );
                  } else {
                    handleNameCheck(nickName);
                  }
                }}
              >
                <AppText weight={'bold'} size={18} color={colors.white}>
                  확인
                </AppText>
              </AppTouchable>
            </View>
          </TouchableWithoutFeedback>
        </>
      )}

      {loading && <AppLoading />}
    </Screen>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: toSize(24),
  },
  completeContainer: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    // justifyContent: 'center',
    paddingTop: (screenHeight * 108) / 667,
  },
  completeView: {
    alignItems: 'center',
    marginTop: toSize(50),
  },
  confirm: {
    backgroundColor: colors.ColorC4C4C4,
    marginTop: toSize(18),
  },
  profile: {
    marginTop: toSize(25),
    marginBottom: toSize(20),
    alignSelf: 'center',
  },
  input: {
    flex: 1,
  },
  warning: {
    borderColor: colors.ColorEC0000,
    marginBottom: toSize(4),
    paddingHorizontal: 0,
  },
  notWarning: {
    borderColor: colors.ColorC4C4C4,
    marginBottom: toSize(18),
    paddingHorizontal: 0,
  },
});
