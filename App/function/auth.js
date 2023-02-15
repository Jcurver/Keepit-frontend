import jwt_decode from 'jwt-decode';
import store from '../store';
import { setAuthInfo } from '../store/feature/userSlice';
import { baseURL } from '../api';
import {
  ACCESS_REFRESH_TOKEN_EXPIRED,
  ACCESS_TOKEN_UPDATE_FAILED,
  REFRESH_TOKEN_EXPIRED,
  REFRESH_TOKEN_UPDATE_FAILED,
} from '../constants/token';
import { logout } from './logout';
import Config from 'react-native-config';
import authStorage from '../config/authStorage';
import CryptoJS from 'react-native-crypto-js';

export const checkAndUpdateAccessToken = async (authInfo) => {
  let decodeAccessToken = await jwt_decode(authInfo?.accessToken);
  let decodeRefreshToken = await jwt_decode(authInfo?.refreshToken);
  // 둘다 만료됐거나 리프레시만 만료된 경우는 이상한 상황이므로 반환.
  // 리프레시토큰은 1분마다 확인하고 타 로직에서 갱신됨.
  if (decodeRefreshToken?.exp < Date.now() / 1000) {
    // 자동 로그아웃
    console.log(ACCESS_REFRESH_TOKEN_EXPIRED);
    return ACCESS_REFRESH_TOKEN_EXPIRED;
  }
  // 엑세스 토큰이 신선한 경우 그대로 반환.
  store.dispatch(setAuthInfo(authInfo));

  if (decodeAccessToken?.exp >= Date.now() / 1000) {
    return authInfo.accessToken;
  }
  // 엑세스 만료 및 리프레시 신선한경우 엑세스토큰 업데이트
  // 이때 리프레쉬는 신선하다고 가정함. 이미 1분마다 갱신되기때문.
  let request = await fetch(baseURL + '/auth/refresh/access-token', {
    method: 'post',
    headers: {
      REFRESH_TOKEN: `Bearer ${authInfo.refreshToken}`,
    },
  });

  let responseJson = await request
    .json()
    .then((d) => d)
    .catch((e) => e);
  if (responseJson.apiStatus.apiCode === 200) {
    console.log('엑세스 토큰 갱신 요청 성공 !', responseJson.data.accessToken);

    store.dispatch(
      setAuthInfo({
        ...authInfo,
        accessToken: responseJson.data.accessToken,
      }),
    );

    return responseJson.data.accessToken;
  } else {
    console.log(ACCESS_TOKEN_UPDATE_FAILED);
    return ACCESS_TOKEN_UPDATE_FAILED;
  }
};

export const checkAndUpdateRefreshToken = async (authInfo) => {
  let decodeRefreshToken = await jwt_decode(authInfo?.refreshToken);
  // 리프레시 토큰이 만료된 경우.

  if (decodeRefreshToken.exp < Date.now() / 1000) {
    console.log(REFRESH_TOKEN_EXPIRED);
    return REFRESH_TOKEN_EXPIRED;
  }
  let dueTime;
  if (Config.ENV === 'DEVELOP') {
    dueTime = 60 * 2.5;
  } else {
    dueTime = 60 * 60 * 24 * 15;
  }
  // 리프레시토큰이 만료되지는 않고 15일 이하로 남았으므로 업데이트해야한다.
  // 그전에 엑세스토큰이 만료된경우 리프레시토큰을 통해 재발급받는다.
  // 리프레시 토큰 주기가 15일 이상 남은 경우 그대로 반환한다.
  if (decodeRefreshToken.exp > Date.now() / 1000 + dueTime) {
    return authInfo.refreshToken;
  }

  let newAccessToken = await checkAndUpdateAccessToken(authInfo)
    .then((res) => res)
    .catch((error) => console.log('ERR', error));

  // 엑세스토큰 재발행에 문제가 생긴경우 로그아웃시킨다.
  if (
    newAccessToken === ACCESS_REFRESH_TOKEN_EXPIRED ||
    newAccessToken === ACCESS_TOKEN_UPDATE_FAILED
  ) {
    await logout();
    return;
  }
  //리프레시 토큰을 재발급한다.
  let request = await fetch(baseURL + '/auth/refresh/refresh-token', {
    method: 'post',
    headers: {
      ACCESS_TOKEN: `Bearer ${newAccessToken}`,
    },
  });
  let responseJson = await request.json();
  console.log(responseJson);
  if (responseJson.apiStatus.apiCode === 200) {
    console.log(
      '리프레쉬 토큰 갱신 요청 성공!',
      responseJson.data.refreshToken,
    );
    let newRefreshToken = responseJson.data.refreshToken;
    console.log('MID REF:: ', responseJson.data?.MID, responseJson.data);
    store.dispatch(
      setAuthInfo({
        ...authInfo,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      }),
    );
    return newRefreshToken;
  } else {
    console.log(REFRESH_TOKEN_UPDATE_FAILED);
    return REFRESH_TOKEN_UPDATE_FAILED;
  }
};

// 401에러가 나올 수 있는 API호출 할 때 사용하는 함수
// 헤더에 엑세스 토큰을 넣는 API함수
export const callApi = (
  apiFunction,
  apiData,
  afterFunction,
  accessToken = true,
) => {
  apiFunction(apiData && apiData).then(async (res) => {
    // afterFunction(res);
    console.log(res.data);
    if (
      res?.data?.apiStatus?.apiCode === 401 &&
      res?.data?.apiStatus?.message === 'Unauthorized' &&
      accessToken
    ) {
      authStorage.retrieveUser().then(async (storedUser) => {
        const newAccessToken = await checkAndUpdateAccessToken(storedUser);
        if (
          newAccessToken === ACCESS_REFRESH_TOKEN_EXPIRED ||
          newAccessToken === ACCESS_TOKEN_UPDATE_FAILED
        ) {
          await logout();
        } else {
          callApi(apiFunction, apiData, afterFunction);
        }
      });
    } else {
      afterFunction(res);
    }
  });
};

export const changePhoneNum = (num) => {
  if (num.length < 4) {
    return num;
  } else if (num.length < 7) {
    let temp = num.slice(0, 3) + '-' + num.slice(3, num.length);
    // console.log(temp);
    return temp;
  } else if (num.length === 11) {
    let temp =
      num.slice(0, 3) + '-' + num.slice(3, 7) + '-' + num.slice(7, num.length);
    return temp;
  } else {
    let temp =
      num.slice(0, 3) + '-' + num.slice(3, 6) + '-' + num.slice(6, num.length);
    return temp;
  }
};

export const encryptData = (data) => {
  var key = CryptoJS.enc.Latin1.parse(Config.AES_KEY);
  var iv = CryptoJS.enc.Latin1.parse(Config.AES_IV);
  var plaintextData = CryptoJS.AES.encrypt(data, key, {
    iv: iv,
  });
  return plaintextData.toString();
};

export const decryptData = (data) => {
  var rawData = CryptoJS.enc.Base64.parse(data);
  var key = CryptoJS.enc.Latin1.parse(Config.AES_KEY);
  var iv = CryptoJS.enc.Latin1.parse(Config.AES_IV);
  var plaintextData = CryptoJS.AES.decrypt({ ciphertext: rawData }, key, {
    iv: iv,
  });
  return plaintextData.toString(CryptoJS.enc.Latin1);
};
