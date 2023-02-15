import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Image, Keyboard } from 'react-native';

import MyIcon from 'config/icon-font';
import { colors, toSize } from 'config/globalStyle';
import { styles } from './style';
import AppTouchable from '../../../common/appTouchable';
import AppKeyboardAvoidingView from '../../../common/appKeyboardAvoidingView';
import AppTextInput from '../../../common/appTextInput';
import AppText from '../../../common/appText';
import ImagePicker from 'react-native-image-crop-picker';
import Permissions, { PERMISSIONS } from 'react-native-permissions';
import { postImageServer } from 'function/image';
import SettingLinking from '../../../common/settingLinking';
import { useDispatch, useSelector } from 'react-redux';
import store from '../../../../store';
import { fromPairs, stubArray } from 'lodash';
import {
  resetCommentData,
  resetCommentTargetIndex,
  setSubmitButtonState,
} from '../../../../store/feature/reviewSlice';
import AppImage from '../../../common/appImage';
import Svg from '../../../../asset/svg';
import Config from 'react-native-config';
import { image_small } from '../../../../constants/imageSize';

const ReviewDetailKeyboard = ({
  form,
  setForm,
  formSubmit,
  keyboardInputRef,
  isCommentSubmitLoading,
  groupIsDelete = false,
}) => {
  const dispatch = useDispatch();
  const [isKeyboardShow, setIsKeybordShow] = useState(false);
  const [storageImageUri, setStorageImageUri] = useState();
  const [isImageLoading, setIsImageLoading] = useState(false);
  const keyboardState = store?.getState()?.review?.submitButton;
  const [inputHeight, setInputHeight] = useState(toSize(32));
  const selectedCommentData = useSelector(
    (state) => state.review.selectedCommentData,
  );
  const submitButtonState = useSelector((state) => state.review.submitButton);
  console.log('form:: ', form);

  const selectImage = useCallback(() => {
    const imageUploadToStorage = async (picsArr) => {
      const image = await postImageServer(picsArr, 'review');
      setStorageImageUri(image);
      setIsImageLoading(false);
      setForm({
        ...form,
        image: `${Config.IMAGE_SERVER_URI}/${image?.data}${image_small}`,
      });
    };
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
            setForm({ ...form, image: image?.uri });
            keyboardInputRef.current.focus();
            imageUploadToStorage(image);
          })
          .catch((error) => {
            setIsImageLoading(false);
            console.log(error);
          });
      } else {
        setIsImageLoading(false);
        SettingLinking({ title: '사진첩' });
      }
    });
  }, [form, setForm, keyboardInputRef]);

  return (
    <AppKeyboardAvoidingView alwaysVisibleFeature>
      {form?.image ? (
        <View style={styles.imageContainer}>
          <AppTouchable onPress={() => setForm({ ...form, image: '' })}>
            <MyIcon
              size={toSize(14)}
              name="ic_close"
              color="white"
              style={styles.removeImageIcon}
            />
          </AppTouchable>
          <AppImage style={styles.image} source={{ uri: form.image }} />
        </View>
      ) : (
        <></>
      )}
      {submitButtonState === 'edit' || selectedCommentData ? (
        <View style={styles.editCloseView}>
          <AppTouchable
            style={styles.editCloseButton}
            onPress={() => {
              dispatch(setSubmitButtonState('submit'));
              dispatch(resetCommentData());
              dispatch(resetCommentTargetIndex());
              setIsKeybordShow(false);
              setForm({ comment: '', image: '' });
              Keyboard.dismiss();
            }}
          >
            <MyIcon
              name="ic_close"
              size={toSize(12)}
              color={colors.Color6B6A6A}
            />
          </AppTouchable>
        </View>
      ) : (
        <View style={styles.inputTopGrayLine} />
      )}
      {groupIsDelete ? (
        <View
          style={[
            styles.commentBottomTouchable,
            // { backgroundColor: colors.ColorE5E5E5 },
          ]}
        >
          <View
            style={[
              styles.commentBottomInput,
              { paddingTop: toSize(6), backgroundColor: colors.ColorE5E5E5 },
            ]}
          >
            <AppText color={colors.ColorC4C4C4}>댓글을 입력해주세요.</AppText>
          </View>
        </View>
      ) : (
        <AppTouchable
          style={[
            isKeyboardShow
              ? styles.commentUpContainer
              : styles.commentBottomTouchable,
          ]}
        >
          <AppTextInput
            multiline={true}
            value={form.comment}
            onChangeText={(comment) => setForm({ ...form, comment })}
            onChange={(e) => {
              setInputHeight(e?.nativeEvent?.contentSize?.height);
            }}
            onFocus={() => setIsKeybordShow(true)}
            onBlur={() => {
              if (!form.comment && !form.image) {
                setIsKeybordShow(false);
              }
            }}
            inputRef={keyboardInputRef}
            style={[
              isKeyboardShow
                ? styles.commentUpInput
                : styles.commentBottomInput,
              { maxHeight: toSize(98) },
            ]}
            placeholder={`${
              selectedCommentData ? '답' : '댓'
            }글을 입력해주세요.`}
            maxLength={1500}
          />
          {isKeyboardShow ? (
            <>
              <AppTouchable
                onPress={() => {
                  keyboardInputRef.current.focus();
                  selectImage();
                }}
              >
                <MyIcon
                  name="camera_outline"
                  size={toSize(20)}
                  style={styles.cameraIcon}
                  color={form?.image ? 'gray' : colors.Color2D2F30}
                />
              </AppTouchable>
              <AppTouchable
                onPress={() => {
                  if (
                    !isImageLoading &&
                    (form.comment.replaceAll(' ', '').replaceAll('\n', '') ||
                      form.image) &&
                    !isCommentSubmitLoading
                  ) {
                    formSubmit();
                  }
                }}
                style={[
                  styles.formSubmit,
                  !isImageLoading &&
                  (form.comment.replaceAll(' ', '').replaceAll('\n', '') ||
                    form.image)
                    ? { backgroundColor: colors.primary }
                    : { backgroundColor: colors.ColorC4C4C4 },
                ]}
              >
                <AppText color="white">등록</AppText>
              </AppTouchable>
            </>
          ) : (
            <></>
          )}
        </AppTouchable>
      )}
    </AppKeyboardAvoidingView>
  );
};

export default ReviewDetailKeyboard;
