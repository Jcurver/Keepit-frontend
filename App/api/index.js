import { create } from 'apisauce';
import axios from 'axios';
import Config from 'react-native-config';
import authStorage from '../config/authStorage';

import { checkAndUpdateAccessToken } from '../function/auth';
// import { Alert } from 'react-native';
// import Toast from 'react-native-simple-toast';
// import { postAuthToken } from './public';
// import RootNavigation from '~/RootNavigation';
//import authStorage from '~/auth/authStorage';
import {
  printErrorConsole,
  printRequestConsole,
  printResponseConsole,
} from '../function/console';

export const baseURL =
  `${Config.ENV}` === 'DEVELOP'
    ? `${Config.SERVER_URI}/alpha`
    : `${Config.AWS_SERVER_URI}`;

const setInterceptors = (instance, isHeader = true) => {
  instance.interceptors.request.use(
    async (config) => {
      printRequestConsole(config);
      // 유저 정보가 있을 경우 헤더에 자동으로 엑세스 토큰을 추가
      const storeAccessToken = await authStorage.getAccessToken();
      if (
        storeAccessToken &&
        Object.entries(storeAccessToken).length !== 0 &&
        isHeader
      ) {
        config.headers.ACCESS_TOKEN = `Bearer ${storeAccessToken}`;
      }
      return config;
    },

    (error) => {
      return Promise.reject(error);
    },
  );

  instance.interceptors.response.use(
    (response) => {
      printResponseConsole(response);
      return response;
    },

    async (error) => {
      // printErrorConsole(error);
      console.log(error);
      return error;
    },
  );
  return instance;
};

export const createInstance = (url = baseURL) => {
  const instance = axios.create({ baseURL: url });
  return setInterceptors(instance);
};
export const createInstanceNoHeader = (url = baseURL) => {
  const instance = axios.create({ baseURL: url });
  return setInterceptors(instance, false);
};

export const KI = create({ axiosInstance: createInstance() });
export const KInoHeader = create({ axiosInstance: createInstanceNoHeader() });
