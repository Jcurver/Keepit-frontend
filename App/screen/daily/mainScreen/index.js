import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, Keyboard } from 'react-native';
import Screen from '../../Screen';
import AppHeader from '../../../component/common/appHeader';
import MyIcon from '../../../config/icon-font';
import SubmitButton from '../../../component/button/submitButton';
import AppTextInput from '../../../component/common/appTextInput';
import AppKeyboardAvoidingView from '../../../component/common/appKeyboardAvoidingView';
import AppTouchable from '../../../component/common/appTouchable';
import { styles } from './style';
import AppModal from '../../../component/modal/center';
import RootNavigation from '../../../RootNavigation';
import ImagePicker from 'react-native-image-crop-picker';
import SettingLinking from '../../../component/common/settingLinking';
import Permissions, { PERMISSIONS } from 'react-native-permissions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { colors, toSize } from '../../../config/globalStyle';
import Toast from 'react-native-simple-toast';
import { callApi } from '../../../function/auth';
import { patchDaily } from '../../../api/daily';
import { postImageServer } from '../../../function/image';
import { postReview } from '../../../api/review';
import Config from 'react-native-config';
import AppImage from '../../../component/common/appImage';
import Svg from '../../../asset/svg';

const DailyWriteMainScreen = ({
  route: { params },
  navigation: { goBack },
}) => {
  const contentInput = useRef();
  const titleInput = useRef();
  const [isFocusContent, setIsFocusContent] = useState(false);
  const [exitModalVisible, setExitModalVisible] = useState(false);
  const [submitModalVisible, setSubmitModalVisible] = useState(false);
  const [storageImageUri, setStorageImageUri] = useState();
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [form, setForm] = useState({
    dailyId: 0,
    groupId: 0,
    title: '',
    image: '',
    content: '',
  });

  useEffect(() => {
    if (params?.fromScreen) {
      setForm(params);
    }
  }, [params]);

  const imageUploadToStorage = async (picsArr) => {
    const image = await postImageServer(picsArr, 'review');
    setStorageImageUri(image);
    setIsImageLoading(false);
  };

  const handleSubmit = (res) => {
    switch (res.data.apiStatus.apiCode) {
      case 200:
        Toast.showWithGravity(
          '일상글이 등록되었어요!',
          Toast.SHORT,
          Toast.TOP,
          ['RCTModalHostViewController'],
        );
        goBack();
        break;

      case 201:
        Toast.showWithGravity(
          '일상글이 수정되었어요!',
          Toast.SHORT,
          Toast.TOP,
          ['RCTModalHostViewController'],
        );
        goBack();
        break;

      case 400:
        console.log('BAD REQUEST 400');
        break;
    }
    console.log('RESPONSE_STATUS_CODE::', res.data.apiStatus.apiCode);
    console.log('RESPONSE_MESSAGE:: ', res.data.apiStatus.message);
  };

  const onSubmit = () => {
    if (!form.title || !form.content) {
      setSubmitModalVisible(true);
      return;
    }

    const dailyPostData = {
      groupId: form.groupId,
      title: form.title,
      image: form.image,
      content: form.content,
    };

    const dailyPatchData = { ...dailyPostData, daliyId: form.dailyId };

    if (form.dailyId) {
      callApi(patchDaily, dailyPatchData, handleSubmit);
    } else {
      callApi(postReview, dailyPostData, handleSubmit);
    }
  };

  const selectImage = useCallback(() => {
    if (form.image) {
      console.log('사진을 1장까지만 첨부할 수 있어요');
      return;
    }

    setIsImageLoading(true);

    Permissions.request(PERMISSIONS.IOS.PHOTO_LIBRARY).then((res) => {
      if (res === 'granted' || res === 'limited') {
        ImagePicker.openPicker({
          compressImageQuality: 0.8,
          mediaType: 'photo',
          includeExif: true,
          forceJpg: true,
          compressImageMaxWidth: 1300,
        })
          .then((pic) => {
            const image = {
              uri: 'file://' + pic.path,
              type: pic.mime,
              name: 'image.jpeg',
            };
            setForm({ ...form, image });
            contentInput.current.focus();
            imageUploadToStorage(image);
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        SettingLinking({ title: '사진첩' });
      }
    });
  }, [form]);

  return (
    <Screen>
      <AppHeader
        title={`일상 글${form.dailyId ? '수정' : '쓰기'}`}
        leftIcon={Svg('close_thin')}
        leftIconPress={() => {
          if (form.title || form.content || form.image) {
            setExitModalVisible(true);
          } else {
            RootNavigation.goBack();
          }
        }}
        titleType="center"
        style={styles.headerStyle}
      />

      <View style={[styles.inputView, styles.inputTitleView]}>
        <AppTextInput
          value={form.title}
          maxLength={50}
          onChangeText={(title) => setForm({ ...form, title })}
          size={20}
          placeholder="제목을 입력해 주세요"
          returnKeyType="next"
          inputRef={titleInput}
          onSubmitEditing={() => {
            contentInput?.current?.focus();
          }}
          blurOnSubmit={false}
        />
      </View>

      <View style={styles.grayline} />

      <KeyboardAwareScrollView
        extraScrollHeight={toSize(380)}
        keyboardShouldPersistTaps={'handled'}
      >
        <View style={styles.inputView}>
          <AppTextInput
            value={form.content}
            multiline={true}
            maxLength={2000}
            onChangeText={(content) => setForm({ ...form, content })}
            size={16}
            inputRef={contentInput}
            onFocus={() => {
              setIsFocusContent(true);
            }}
            onBlur={() => {
              setIsFocusContent(false);
            }}
            placeholder="내용을 입력해 주세요"
          />
          <View style={styles.imageView}>
            {form.image ? (
              <>
                <AppImage
                  style={styles.image}
                  source={{
                    uri: form.image.uri
                      ? form.image.uri
                      : `${Config.SERVER_URI}/files/review/medium${storageImageUri}`,
                  }}
                />
                <AppTouchable
                  style={[styles.imageCloseButton]}
                  onPress={() => {
                    setForm({ ...form, image: null });
                    contentInput.current.focus();
                  }}
                >
                  {Svg('close_thin')}
                </AppTouchable>
              </>
            ) : null}
          </View>
        </View>
      </KeyboardAwareScrollView>

      <AppKeyboardAvoidingView alwaysVisibleFeature>
        <SubmitButton
          canClick={!isImageLoading}
          fixBottom={false}
          onPress={() => onSubmit()}
        >
          확인
        </SubmitButton>
        {isFocusContent ? (
          <View style={styles.keyboardFeature}>
            <AppTouchable onPress={() => selectImage()}>
              <MyIcon
                size={toSize(16)}
                name={'ic_image'}
                color={form.image ? colors.ColorC4C4C4 : colors.Color2D2F30}
              />
            </AppTouchable>
            <AppTouchable onPress={() => Keyboard.dismiss()}>
              <MyIcon size={toSize(16)} name={'ic_keyboardoff'} />
            </AppTouchable>
          </View>
        ) : null}
      </AppKeyboardAvoidingView>

      {/* <TwoButtonModal
        leftButtonText={'취소'}
        rightButtonText={'나가기'}
        content={'정말 나가시겠어요?'}
        subContent={'입력한 내용이 저장되지 않아요.'}
        visible={exitModalVisible}
        onPressLeft={() => setExitModalVisible(false)}
        onPressRight={() => {
          setExitModalVisible(false);
          RootNavigation.goBack();
        }}
      /> */}

      <AppModal
        buttonText={'확인'}
        content={'제목, 내용은 필수 입력 항목이에요.'}
        visible={submitModalVisible}
        onPress={() => {
          setSubmitModalVisible(false);
        }}
      />
    </Screen>
  );
};

export default DailyWriteMainScreen;
