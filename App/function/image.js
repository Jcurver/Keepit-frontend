import Config from 'react-native-config';
import { Alert, Image } from 'react-native';
import qs from 'qs';
import store from '../store';
import { baseURL } from '../api';

export const postImageServer = async (image, type) => {
  const authInfo = store.getState().user.authInfo;
  const type_uppercase = type.toUpperCase();

  console.log('imageQQQ:: ', image);
  // 이미지가 여러장인 경우
  if (image[0]?.uri) {
    let formDataList = [];
    for (const img of image) {
      let formData = new FormData();
      formData.append('image', img);
      formData.append('type', type_uppercase);
      formDataList.push(
        await (
          await fetch(baseURL + '/image/upload', {
            method: 'post',
            body: formData,
            headers: {
              'Content-Type': 'multipart/form-data',
              ACCESS_TOKEN: `Bearer ${authInfo.accessToken}}`,
            },
          })
        ).json(),
      );
    }
    return await Promise.all(formDataList);
    // 이미지가 한장인 경우
  } else if (type_uppercase === 'PROFILE') {
    let formData = new FormData();
    formData.append('image', image);
    formData.append('type', type_uppercase);
    return await (
      await fetch(baseURL + '/image/profile/upload', {
        method: 'post',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    ).json();
  } else {
    let formData = new FormData();
    formData.append('image', image);
    formData.append('type', type_uppercase);
    return await (
      await fetch(baseURL + '/image/upload', {
        method: 'post',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          ACCESS_TOKEN: `Bearer ${authInfo.accessToken}}`,
        },
      })
    ).json();
  }

  // axios통해서 통신시 계속 오류나서 이렇게 수정함
  // if (responseJson.images[0] === undefined) {
  //   Alert.alert('이미지 서버 오류입니다.');
  //   return false;
  // }
  // if (image[0]?.uri) {
  //   return responseJson.images;
  // } else {
  //   return responseJson.images[0];
  // }
};

export const deleteImageServer = async (imageArr, type) => {
  // 기존 리턴 유지. 이미지를 배열로 받는경우 결과 역시 배열로 리턴하도록 함수 변경
  const deleteSlashImageArr = [];
  for (const image of imageArr) {
    deleteSlashImageArr.push(image.slice(1));
  }
  const imageJoin = deleteSlashImageArr.join(',');

  let request = await fetch(`${Config.SERVER_URI}/image/${type}`, {
    method: 'delete',
    body: qs.stringify({ files: imageJoin }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  console.log('request:: ', request);
};

export const ImageRatio = (url, setWidth, setHeight, maxWidth, maxHeight) => {
  Image.getSize(url, (width, height) => {
    if (maxWidth && !maxHeight) {
      if (width > maxWidth) {
        const resizeHeight = (maxWidth * height) / width;
        setWidth(maxWidth);
        setHeight(resizeHeight);
      } else {
        setWidth(width);
        setHeight(height);
      }
    } else if (!maxWidth && maxHeight) {
      if (height > maxHeight) {
        const resizeWidth = (maxHeight * width) / height;
        setWidth(resizeWidth);
        setHeight(maxHeight);
      } else {
        setWidth(width);
        setHeight(height);
      }
    }
  });
};
