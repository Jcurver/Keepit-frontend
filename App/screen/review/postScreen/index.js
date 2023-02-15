import React, { useState, useEffect } from 'react';
import { View, Keyboard } from 'react-native';
import Screen from '../../Screen';
import AppHeader from 'component/common/appHeader';
import AppText from 'component/common/appText';
import AppTouchable from 'component/common/appTouchable';
import AppTextInput from 'component/common/appTextInput';
import AppKeyboardAvoidingView from 'component/common/appKeyboardAvoidingView';
import { colors } from 'config/globalStyle';
import MyIcon from 'config/icon-font';
import RootNavigation from 'RootNavigation';
import { styles } from './styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import SubmitButton from 'component/button/submitButton';
import DraggableImageList from 'component/review/postScreen/draggableImageList/index.js';
import PlaceRegistView from 'component/review/postScreen/placeRegistView/index.js';
import AppModal from 'component/modal/center';
import { storeReviews } from 'config/reviewStorage';
import { toSize } from 'config/globalStyle';
import { callApi } from 'function/auth';
import { postReview, patchReview } from 'api/review';
import { useDispatch, useSelector } from 'react-redux';
import { deleteImageServer } from '../../../function/image';
import { nowDate } from '../../../function/nowdate';
import Svg from '../../../asset/svg';
import { setMapRefresh } from '../../../store/feature/groupSlice';
import { setFromMap } from '../../../store/feature/reviewSlice';
import store from '../../../store';

const ReviewPostScreen = ({ route: { params } }) => {
  console.log('params:: ', params);
  const ids = useSelector((state) => state.user.ids);
  const [storageImageUriArr, setStorageImageUriArr] = useState([]);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isFocusContent, setIsFocusContent] = useState(false);
  const [modal, setModal] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [deleteStorageImageUriArr, setDeleteStroageImageUriArr] = useState([]);
  // const nowPage = useSelector((state) => state.user.nowPage);
  const nowPage = params?.nowPage;
  const [editStartData, setEditStartData] = useState();
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [isText, setIsText] = useState(false);
  const [isBottomSheet, setIsBottomSheet] = useState(false);
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    selectedGroupName: '',
    selectedPlace: '',
    selectedImageArr: [],
    explain: '',
  });
  console.log('form:: ', form);
  console.log('POSTFparams:: ', params);
  console.log('nowPage:: ', nowPage);
  useEffect(() => {
    if (form.selectedImageArr[0] === '') {
      setForm((form) => ({
        ...form,
        selectedImageArr: form?.selectedImageArr.slice(1),
      }));
    }
  }, [form?.selectedImageArr]);

  useEffect(() => {
    if (!params?.bottomSheetData && params?.fromScreen === 'MapScreen') {
      dispatch(setFromMap(true));
    }
    if (params?.bottomSheetData) {
      setIsBottomSheet(true);
      setForm((f) => ({
        ...f,
        selectedPlace: JSON.stringify(params.bottomSheetData),
      }));
    } else if (params?.fromScreen === 'ReviewTemporaryScreen') {
      const getData = () => {
        const tempData = params;
        console.log('tempData:: ', tempData);
        // console.log('tempData:: ', JSON.stringify(tempData));
        setForm(tempData);
      };
      getData();
      // 리뷰를 수정하는 경우
    } else if (params?.reviewData && nowPage === 'review_edit') {
      const editData = {
        selectedGroupName: ids?.groupName,
        selectedPlace: JSON.stringify({
          placeId: params?.reviewData?.placeId,
          placeName: params?.reviewData?.placeName,
          roadAddress: params.reviewData?.placeAddress,
        }),
        selectedImageArr:
          params?.reviewData?.reviewImagesUrl[0] !== ''
            ? params?.reviewData?.reviewImagesUrl
            : [],
        explain: params?.reviewData?.reviewContent,
      };
      setForm(editData);
      setStorageImageUriArr(editData.selectedImageArr);
      setEditStartData(editData);
    } else {
      setForm({
        ...params,
        selectedImageArr: params?.selectedImageArr
          ? params.selectedImageArr
          : [],
        explain: params?.explain ? params.explain : '',
        selectedGroupName: ids?.groupName,
        groupId: ids.groupId,
      });
    }
  }, [params, ids, nowPage, dispatch]);

  const nowdate = () => nowDate('.');

  const handleSubmit = (res) => {
    setIsApiLoading(false);
    switch (res.data.apiStatus.apiCode) {
      case 200:
        // params.setDoRefreshReview(true);
        console.log(params);

        RootNavigation.navigate('ReviewDetailScreen', {
          nowPage: params?.nowPage,
          ids: {
            groupId: ids.groupId,
            reviewId: ids.reviewId,
            fromHome: params.fromDetailScreen === 'Home' ? true : false,
            fromProfile: params.fromDetailScreen === 'Profile' ? true : false,
            fromKeep: params.fromDetailScreen === 'Keep' ? true : false,
            fromInfo: params.fromDetailScreen === 'Info' ? true : false,
            fromUser: params.fromDetailScreen === 'User' ? true : false,
            toastText: `리뷰글이 ${
              nowPage === 'review_edit' ? '수정' : '등록'
            }되었어요!`,
            isRefresh: true,
          },
          fromScreen:
            params?.fromScreen === 'MapScreen' ? 'MapScreen' : undefined,
          isRefresh: true,
        });

        break;

      case 201:
        if (params?.fromScreen === 'MapScreen') {
          RootNavigation.goBack();
        } else {
          RootNavigation.navigate('GroupHomeScreen', {
            groupId: ids.groupId,
            toastText: `리뷰글이 ${
              nowPage === 'review_edit' ? '수정' : '등록'
            }되었어요!`,
            isRefresh: true,
            ids: {
              isRefresh: true,
            },
          });
        }
        break;

      case 811:
        // Toast.showWithGravity('이미 작성된 리뷰에요!', Toast.SHORT, Toast.TOP, [
        //   'RCTModalHostViewController',
        // ]);
        console.log('isNotNew:: ');
        break;

      case 999:
        console.log('올바르지 않은 데이터 999');
        break;

      case 400:
        console.log('BAD REQUEST 400');
        break;

      case 813:
        console.log('그룹에 속해있지 않아요 813');
        break;
    }
    console.log('RESPONSE_STATUS_CODE::', res.data.apiStatus.apiCode);
    console.log('RESPONSE_MESSAGE:: ', res.data.apiStatus.message);
  };

  const onSubmit = () => {
    if (
      nowPage === 'review_edit' &&
      editStartData?.explain === form.explain &&
      editStartData?.selectedPlace === form.selectedPlace &&
      editStartData?.selectedImageArr === form.selectedImageArr
    ) {
      RootNavigation.goBack();
      return;
    }
    setModal(true);
    if (form?.explain.length === 0 || !form?.selectedPlace) {
      setModalContent('장소, 내용은 필수 입력 항목이에요.');
      return;
    } else if (form?.explain.length < 15) {
      setModalContent(
        `내용을 15자 이상 작성해주세요.\n현재 ${form?.explain.length}자를 작성했어요.`,
      );
      return;
    } else if (form?.explain.length > 2000) {
      setModalContent(
        `내용을 2000자 이내로 작성해주세요.\n현재 ${form?.explain.length}자를 작성했어요.`,
      );
      return;
    }

    setModal(false);
    setIsApiLoading(true);

    const placeId = params?.placeId
      ? params?.placeId
      : Number(JSON.parse(form?.selectedPlace).placeId);
    const img = [];
    form?.selectedImageArr.forEach((i) => img.push[i.url]);

    const imageArrSuccess = [];
    for (let image of form?.selectedImageArr) {
      if (image?.data) {
        imageArrSuccess.push(image.data);
      } else if (typeof image === 'string' && image) {
        imageArrSuccess.push(image);
      }
    }
    // console.log('storageImageUriArr:: ', storageImageUriArr);
    console.log('imageArrSuccess:: ', imageArrSuccess);

    const reviewPostData = {
      groupId: ids.groupId,
      reviewData: {
        placeId,
        content: form.explain,
        images: imageArrSuccess,
      },
    };

    if (nowPage === 'review_edit') {
      const reviewPatchData = Object.assign(reviewPostData, {
        reviewId: ids.reviewId,
      });
      callApi(patchReview, reviewPatchData, handleSubmit);
    } else {
      callApi(postReview, reviewPostData, handleSubmit);
    }
    if (deleteStorageImageUriArr.length > 0) {
      deleteImageServer(deleteStorageImageUriArr, 'review');
    }
  };

  const saveContents = () => {
    if (
      !form?.selectedPlace &&
      form?.selectedImageArr.length === 0 &&
      !form?.explain
    ) {
      return;
    }
    storeReviews(Object.assign({ date: nowdate() }, form));
  };
  useEffect(() => {
    const replaceExplain = form?.explain
      .replaceAll(' ', '')
      .replaceAll('\n', '');
    if (replaceExplain === '') {
      setIsText(false);
    } else {
      setIsText(true);
    }
  }, [form?.explain]);

  return (
    <Screen>
      <AppHeader
        title={`리뷰${nowPage === 'review_edit' ? '수정' : '쓰기'}`}
        leftIcon={Svg('close_thin')}
        iconStyle={{ left: toSize(6) }}
        leftIconPress={() => {
          console.log(
            nowPage,
            editStartData?.explain === form.explain,
            editStartData?.selectedPlace === form.selectedPlace,
            editStartData?.selectedImageArr === form.selectedImageArr,
          );
          if (
            nowPage === 'review_edit' &&
            editStartData?.explain === form.explain &&
            editStartData?.selectedPlace === form.selectedPlace &&
            editStartData?.selectedImageArr === form.selectedImageArr
          ) {
            if (params?.fromScreen === 'ReviewDetailScreen') {
              RootNavigation.goBack();
            } else if (
              params?.fromScreen === 'MapScreen' ||
              store.getState().review.fromMap
            ) {
              if (store.getState().review.fromMap) {
                dispatch(setFromMap(false));
              }
              dispatch(setMapRefresh(false));
              RootNavigation.goBack();
            } else {
              RootNavigation.navigate('GroupHomeScreen', {
                groupId: ids.groupId,
                toastText: undefined,
              });
            }
          } else {
            if (
              params?.fromScreen === 'MapScreen' ||
              store.getState().review.fromMap
            ) {
              if (store.getState().review.fromMap) {
                dispatch(setFromMap(false));
              }
              dispatch(setMapRefresh(false));
              RootNavigation.goBack();
            } else {
              saveContents();
              RootNavigation.navigate('GroupHomeScreen', {
                groupId: ids.groupId,
                toastText:
                  form?.selectedPlace || form?.explain
                    ? '리뷰글이 임시저장되었어요.'
                    : undefined,
              });
            }
          }
        }}
        titleType="center"
        style={styles.headerStyle}
        rightIcon={
          nowPage === 'review_edit' ? (
            <></>
          ) : (
            <View style={styles.headerRightButton}>
              <AppText size={16}>임시</AppText>
            </View>
          )
        }
        rightIconPress={() => {
          if (nowPage !== 'review_edit') {
            RootNavigation.navigate('ReviewTemporaryScreen', {
              fromScreen: isBottomSheet ? 'map' : undefined,
            });
          }
        }}
      />

      <KeyboardAwareScrollView bounces={false} extraHeight={toSize(30)}>
        <View style={styles.groupTitleText}>
          <AppText color={colors.Color191919} size={16} lineHeight={24}>
            {ids.groupName}
          </AppText>
        </View>
        <View style={styles.grayline} />
        <PlaceRegistView
          form={form}
          isImageLoading={isImageLoading}
          fromDetailScreen={params?.fromDetailScreen}
          nowPage={params?.nowPage}
        />
        <DraggableImageList
          form={form}
          setForm={setForm}
          storageImageUriArr={storageImageUriArr}
          isImageLoading={isImageLoading}
          setStorageImageUriArr={setStorageImageUriArr}
          setIsImageLoading={setIsImageLoading}
          setDeleteStroageImageUriArr={setDeleteStroageImageUriArr}
        />
        <View style={styles.grayline} />
        <AppTextInput
          multiline={true}
          maxLength={2000}
          size={16}
          value={form?.explain}
          onChangeText={(text) => setForm({ ...form, explain: text })}
          style={styles.explainContainer}
          placeholder="장소에 대한 경험과 정보를 다른 멤버에게 공유해보세요. (최소 15자 이상 작성)&#13;&#10;장소와 무관한 사진 및 욕설/비속어가 포함된 리뷰는 운영자에 의해 삭제될 수 있습니다."
          onFocus={() => {
            setIsFocusContent(true);
          }}
          onBlur={() => {
            setIsFocusContent(false);
          }}
        />
      </KeyboardAwareScrollView>

      <AppKeyboardAvoidingView alwaysVisibleFeature>
        <SubmitButton
          fixBottom={false}
          style={{ marginBottom: toSize(12) }}
          canClick={!isImageLoading && isText}
          onPress={() => {
            if (isApiLoading) {
              return;
            }
            onSubmit();
          }}
        >
          등록
        </SubmitButton>
        {isFocusContent && (
          <View style={styles.keyboardFeature}>
            <AppTouchable onPress={() => Keyboard.dismiss()}>
              <MyIcon size={toSize(16)} name={'ic_keyboardoff'} />
            </AppTouchable>
          </View>
        )}
      </AppKeyboardAvoidingView>

      <AppModal
        visible={modal}
        content={modalContent}
        buttonText="확인"
        onPress={() => setModal(false)}
      />
    </Screen>
  );
};

export default ReviewPostScreen;
