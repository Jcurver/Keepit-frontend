import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, Keyboard, ScrollView } from 'react-native';
import Screen from '../../Screen';
import AppHeader from '../../../component/common/appHeader';
import MyIcon from '../../../config/icon-font';
import SubmitButton from '../../../component/button/submitButton';
import AppTextInput from '../../../component/common/appTextInput';
import AppKeyboardAvoidingView from '../../../component/common/appKeyboardAvoidingView';
import AppTouchable from '../../../component/common/appTouchable';
import { styles } from './style.js';
import AppModal from '../../../component/common/appModal';
import RootNavigation from '../../../RootNavigation';
import ImagePicker from 'react-native-image-crop-picker';
import SettingLinking from '../../../component/common/settingLinking';
import Permissions, { PERMISSIONS } from 'react-native-permissions';
import { colors, toSize } from '../../../config/globalStyle';
import { callApi } from '../../../function/auth';
import { patchDaily, postDaily } from '../../../api/daily';
import { deleteImageServer, postImageServer } from '../../../function/image';
import Config from 'react-native-config';
import { useSelector } from 'react-redux';
import { WINDOW_HEIGHT } from '@gorhom/bottom-sheet';
import AppImage from 'component/common/appImage';
import Svg from '../../../asset/svg';
import { image_large } from '../../../constants/imageSize';
import { baseURL } from '../../../api';

const DailyPostScreen = ({ route: { params }, navigation: { navigate } }) => {
  const contentInput = useRef();
  const titleInput = useRef();
  const [isFocusContent, setIsFocusContent] = useState(false);
  const [exitModalVisible, setExitModalVisible] = useState(false);
  const [submitModalVisible, setSubmitModalVisible] = useState(false);
  const [storageImageUri, setStorageImageUri] = useState();
  const [deleteStroageImageUri, setDeleteStorageImageUri] = useState([]);
  const ids = useSelector((state) => state.user.ids);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [editStartData, setEditStartData] = useState();
  const [isText, setIsText] = useState(false);
  // const nowPage = useSelector((state) => state.user.nowPage);
  const nowPage = params?.nowPage;
  const [form, setForm] = useState({
    title: '',
    image: '',
    content: '',
  });

  useEffect(() => {
    if (params?.dailyData && nowPage === 'daily_edit') {
      const editData = {
        title: params.dailyData.title,
        content: params.dailyData.content,
        image: params.dailyData?.imageUrl,
      };
      setForm(editData);
      setStorageImageUri(editData.image);
      setEditStartData(editData);
    }
  }, [params, nowPage]);

  const imageUploadToStorage = async (pic) => {
    const image = await postImageServer(pic, 'daily');
    console.log('imageaaa:: ', image);
    if (image?.data) {
      setForm({ ...form, image: pic });
      setStorageImageUri(image.data);
    }
    setIsImageLoading(false);
  };

  const handleSubmit = (res) => {
    setIsApiLoading(false);
    switch (res.data.apiStatus.apiCode) {
      case 201:
        navigate('GroupHomeScreen', {
          groupId: ids?.groupId,
          toastText: '일상글이 등록되었어요!',
          isRefresh: true,
        });

        break;

      case 200:
        navigate('DailyDetailScreen', {
          ids: {
            groupId: ids.groupId,
            dailyId: ids.dailyId,
            fromHome: params.fromDetailScreen === 'Home' ? true : false,
            fromProfile: params.fromDetailScreen === 'Profile' ? true : false,
            fromKeep: params.fromDetailScreen === 'Keep' ? true : false,
            fromUser: params.fromDetailScreen === 'User' ? true : false,
            isRefresh: true,
          },
          toastText: '일상글이 수정되었어요!',
        });
        break;

      case 400:
        console.log('BAD REQUEST 400');
        break;
    }
    console.log('RESPONSE_STATUS_CODE::', res.data.apiStatus.apiCode);
    console.log('RESPONSE_MESSAGE:: ', res.data.apiStatus.message);
  };

  const onSubmit = () => {
    setIsApiLoading(true);
    if (!form.title || !form.content) {
      setSubmitModalVisible(true);
      setIsApiLoading(false);

      return;
    }
    if (
      nowPage === 'daily_edit' &&
      form.content === editStartData.content &&
      form.image === editStartData.image &&
      form.title === editStartData.title
    ) {
      setIsApiLoading(false);
      RootNavigation.goBack();
      return;
    }

    const dailyData = {
      title: form.title,
      content: form.content,
    };

    const dailyPostData = {
      groupId: ids?.groupId,
      dailyData: Object.assign(dailyData, {
        image: storageImageUri,
      }),
    };
    console.log('dailyPostData:: ', dailyPostData);

    if (nowPage === 'daily_edit') {
      const dailyPatchData = {
        groupId: dailyPostData.groupId,
        dailyData: Object.assign(dailyPostData.dailyData, {
          dailyId: ids?.dailyId,
        }),
      };
      callApi(patchDaily, dailyPatchData, handleSubmit);
    } else {
      callApi(postDaily, dailyPostData, handleSubmit);
    }
    if (deleteStroageImageUri.length > 0) {
      deleteImageServer(deleteStroageImageUri, 'daily');
    }
  };

  const selectImage = () => {
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
          compressImageMaxWidth: 1300,
          forceJpg: true,
        })
          .then((pic) => {
            const image = {
              uri: 'file://' + pic.path,
              type: pic.mime,
              name: 'image.jpeg',
            };
            // setForm({ ...form, image });
            contentInput.current.focus();
            imageUploadToStorage(image);
          })
          .catch((error) => {
            console.log(error);
            setIsImageLoading(false);
          });
      } else {
        SettingLinking({ title: '사진첩' });
      }
    });
  };

  useEffect(() => {
    const replaceTitle = form?.title.replaceAll(' ', '').replaceAll('\n', '');
    const replaceExplain = form?.content
      .replaceAll(' ', '')
      .replaceAll('\n', '');
    if (replaceExplain === '' || replaceTitle === '') {
      setIsText(false);
    } else {
      setIsText(true);
    }
  }, [form?.content, form?.title]);

  return (
    <Screen>
      <AppHeader
        title={`일상 글${nowPage === 'daily_edit' ? '수정' : '쓰기'}`}
        leftIcon={Svg('close_thin')}
        iconStyle={{ left: toSize(6) }}
        leftIconPress={() => {
          if (
            form.title ||
            form.content ||
            form.image ||
            nowPage === 'daily_edit'
          ) {
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
          size={18}
          placeholder="제목을 입력해 주세요."
          returnKeyType="next"
          multiline={true}
          inputRef={titleInput}
          onSubmitEditing={() => contentInput?.current?.focus()}
          blurOnSubmit={false}
          style={{ fontWeight: '500' }}
        />
      </View>

      <View style={[styles.grayline, styles.marginHorizontal16]} />

      <ScrollView
        bounces={false}
        extraScrollHeight={toSize(380)}
        keyboardShouldPersistTaps={'handled'}
      >
        <View style={[styles.inputView]}>
          <AppTextInput
            style={[
              storageImageUri || form.image
                ? {}
                : { height: WINDOW_HEIGHT * 0.8 },
            ]}
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
            placeholder="내용을 입력해 주세요."
          />

          <View style={styles.imageView}>
            {form.image && !isImageLoading ? (
              <>
                <AppImage
                  style={styles.image}
                  source={{
                    uri: form?.image?.uri
                      ? form.image.uri
                      : form.image
                      ? `${Config.IMAGE_SERVER_URI}/${form.image}${image_large}`
                      : baseURL + `/${storageImageUri}${image_large}`,
                  }}
                />
                <AppTouchable
                  style={[styles.imageCloseButton]}
                  onPress={() => {
                    setForm({ ...form, image: null });
                    setStorageImageUri(undefined);
                    setDeleteStorageImageUri((imageArr) => [
                      ...imageArr,
                      storageImageUri,
                    ]);

                    contentInput.current.focus();
                  }}
                >
                  <MyIcon name="ic_close" color="white" size={toSize(12)} />
                </AppTouchable>
              </>
            ) : null}
          </View>
        </View>
      </ScrollView>
      <View style={styles.grayline} />
      <AppKeyboardAvoidingView alwaysVisibleFeature>
        <SubmitButton
          canClick={!isImageLoading && isText}
          fixBottom={false}
          onPress={() => {
            if (isApiLoading) {
              return;
            }
            onSubmit();
          }}
          style={{ marginTop: toSize(12), marginBottom: toSize(12) }}
        >
          등록
        </SubmitButton>
        {isFocusContent ? (
          <View style={styles.keyboardFeature}>
            <AppTouchable onPress={() => selectImage()}>
              {form.image
                ? Svg('image_outline_sharp_gray')
                : Svg('image_outline_sharp')}
              {/* <MyIcon
                size={toSize(16)}
                name={'ic_image'}
                color={form.image ? colors.ColorC4C4C4 : colors.Color2D2F30}
              /> */}
            </AppTouchable>
            <AppTouchable onPress={() => Keyboard.dismiss()}>
              <MyIcon size={18} name={'ic_keyboardoff'} />
            </AppTouchable>
          </View>
        ) : null}
      </AppKeyboardAvoidingView>

      <AppModal
        leftButtonText={'취소'}
        rightButtonText={'나가기'}
        title={'정말 나가시겠어요?'}
        content={'입력한 내용이 저장되지 않아요.'}
        visible={exitModalVisible}
        onPressLeft={() => setExitModalVisible(false)}
        onPressRight={() => {
          setExitModalVisible(false);
          RootNavigation.goBack();
        }}
      />

      <AppModal
        rightButtonText={'확인'}
        title={'제목, 내용은 필수 입력 항목이에요.'}
        visible={submitModalVisible}
        onPressRight={() => {
          setSubmitModalVisible(false);
        }}
      />
    </Screen>
  );
};

export default DailyPostScreen;
