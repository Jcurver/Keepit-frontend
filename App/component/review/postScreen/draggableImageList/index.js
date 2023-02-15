import React, { useEffect, useRef, useState } from 'react';
import { DraxProvider, DraxList, DraxViewDragStatus } from 'react-native-drax';
import { View, Image, SafeAreaView } from 'react-native';
import AppTouchable from '../../../common/appTouchable';
import AppText from '../../../common/appText';
import SettingLinking from '../../../common/settingLinking';
import MyIcon from 'config/icon-font';
import ImagePicker from 'react-native-image-crop-picker';
import { styles } from './style';
import Permissions, { PERMISSIONS } from 'react-native-permissions';
import { postImageServer } from 'function/image';
import Config from 'react-native-config';
import AppImage from 'component/common/appImage';
import { image_small } from '../../../../constants/imageSize';
import { toSize } from '../../../../config/globalStyle';

const DraggableImageList = ({
  form,
  setForm,
  storageImageUriArr,
  setStorageImageUriArr,
  isImageLoading,
  setIsImageLoading,
  setDeleteStroageImageUriArr,
}) => {
  console.log('form?.selectedImageArr :: ', form?.selectedImageArr);
  const imageListRef = useRef(null);

  const imagesUploadToStorage = async (picsArr) => {
    const loadingImgArr = Array.from(
      { length: picsArr.length },
      () => '../../../../asset/placeholderImage.png',
    );
    setForm({
      ...form,
      selectedImageArr: [...form.selectedImageArr, ...loadingImgArr],
    });

    const images = await postImageServer(picsArr, 'review');
    console.log('images:: ', images);
    setStorageImageUriArr((img) => [...img, ...images]);
    setIsImageLoading(false);
    const imageArr = [];
    for (let i = 0; i < images.length; i++) {
      console.log('images[i]:: ', images[i]);
      if (images[i].apiStatus.apiCode !== 200) {
        imageArr.push('../../../../asset/google_logo.png');
      } else {
        imageArr.push(images[i].data);
      }
    }
    setForm({
      ...form,
      selectedImageArr: [...form.selectedImageArr, ...imageArr],
    });
  };
  // useEffect(() => {
  //   imagesUploadToStorage(localImageArr);
  // }, [localImageArr]);

  const selectImage = (length) => {
    if (length === 5) {
      return;
    }
    setIsImageLoading(true);
    Permissions.request(PERMISSIONS.IOS.PHOTO_LIBRARY).then((res) => {
      if (res === 'granted' || res === 'limited') {
        ImagePicker.openPicker({
          compressImageQuality: 0.8,
          mediaType: 'photo',
          includeExif: true,
          multiple: true,
          maxFiles: 5 - length,
          compressImageMaxWidth: 1300,
          forceJpg: true,
        })
          .then((pics) => {
            const picsArr = pics.map((pic) => ({
              uri: 'file://' + pic.path,
              type: pic.mime,
              name: 'image.jpeg',
            }));
            console.log('picsArr:: ', picsArr);
            const imgArr = Array.from(
              { length: picsArr.length },
              () => '../../../../asset/placeholderImage.png',
            );
            // setForm({
            //   ...form,
            //   selectedImageArr: imgArr,
            // });
            imagesUploadToStorage(picsArr);
          })
          .catch((error) => {
            console.log('imagePickerError', error);
            setIsImageLoading(false);
          });
      } else {
        SettingLinking({ title: '사진첩' });
      }
    });
  };

  const removeImage = (imageUri) => {
    console.log('imageUri:: ', imageUri);
    let RemovedImageArr;
    if (form?.selectedImageArr[0]?.uri) {
      RemovedImageArr = form?.selectedImageArr.filter(
        ({ uri }) => uri !== imageUri,
      );
    } else if (form?.selectedImageArr[0]?.url) {
      RemovedImageArr = form?.selectedImageArr.filter(
        ({ url }) => url !== imageUri,
      );
    } else {
      RemovedImageArr = form?.selectedImageArr.filter(
        (url) => url !== imageUri,
      );
    }
    // const RemovedImageArr = form?.selectedImageArr.filter(
    //   ({ uri }) => uri !== imageUri,
    // );
    setForm({
      ...form,
      selectedImageArr: RemovedImageArr,
    });
  };

  return (
    <View style={styles.imageSelectScrollView}>
      <AppTouchable
        style={styles.imageSelectButton}
        onPress={() => selectImage(form.selectedImageArr.length)}
      >
        <MyIcon
          name="ic_close"
          size={toSize(20)}
          color="white"
          style={{ transform: [{ rotateZ: '45deg' }] }}
        />
        <AppText style={styles.imageSelectButtonText}>
          <AppText color="#04BF7B">{form.selectedImageArr.length}</AppText>
          /5
        </AppText>
      </AppTouchable>
      <DraxProvider>
        <SafeAreaView
          edges={['top', 'left', 'bottom']}
          style={styles.safeAreaView}
        >
          <DraxList
            lockItemDragsToMainAxis
            showsHorizontalScrollIndicator={false}
            longPressDelay={300}
            flatListStyle={styles.flatListStyle}
            horizontal={true}
            ref={imageListRef}
            data={
              form?.selectedImageArr[0] !== '' ? form?.selectedImageArr : []
            }
            renderItemContent={({ item, index }, { viewState, hover }) => (
              <View
                key={item?.uri ? item.uri : item}
                style={styles.imageContainer}
              >
                <AppImage
                  style={[
                    styles.image,
                    viewState?.dragStatus === DraxViewDragStatus.Dragging &&
                    hover
                      ? styles.imageHover
                      : undefined,
                  ]}
                  // 수정에서 넘어올 경우 저장소 이미지 불러옴.즉 자신의 카메라 경로 또는 저장소 경로 호출
                  source={{
                    uri: item?.uri
                      ? item?.uri
                      : item?.url
                      ? item?.url
                      : `${Config.IMAGE_SERVER_URI}/${item}${image_small}`,
                  }}
                />
                <AppTouchable
                  style={styles.imageCloseIconView}
                  onPress={() => {
                    if (isImageLoading) {
                      return;
                    }
                    setDeleteStroageImageUriArr((arr) => [...arr, item]);
                    setStorageImageUriArr((imgArr) => [
                      ...imgArr.slice(0, index),
                      ...imgArr.slice(index + 1),
                    ]);
                    removeImage(
                      item?.uri ? item.uri : item.url ? item.url : item,
                    );
                  }}
                >
                  <MyIcon name={'ic_close'} size={toSize(12)} color="white" />
                </AppTouchable>
                {index === 0 ? (
                  <View style={styles.firstImage}>
                    <AppText color="white">대표</AppText>
                  </View>
                ) : null}
              </View>
            )}
            onItemReorder={({ fromIndex, toIndex }) => {
              const newData = form?.selectedImageArr.slice();
              newData.splice(toIndex, 0, newData.splice(fromIndex, 1)[0]);
              setForm({ ...form, selectedImageArr: newData });
              const newImageData = storageImageUriArr.slice();
              newImageData.splice(
                toIndex,
                0,
                newImageData.splice(fromIndex, 1)[0],
              );
              setStorageImageUriArr(newImageData);
            }}
            keyExtractor={(item, index) =>
              item?.uri ? '' + item.uri + index : '' + item + index
            }
          />
        </SafeAreaView>
      </DraxProvider>
    </View>
  );
};

export default DraggableImageList;
