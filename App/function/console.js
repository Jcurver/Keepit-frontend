import { useDispatch } from 'react-redux';
import { setAuthInfo } from '../store/feature/userSlice';

export const printRequestConsole = (config) => {
  console.log(
    'Interceptor request@@ : ',
    config.method,
    config.baseURL + config.url,
    '// data :',
    config.data,
    '// params :',
    config.params,
  );
};

export const printResponseConsole = (res) => {
  console.log(
    'Interceptor response@@ : ',
    res.data.apiStatus.apiCode,
    res.config.method,
    res.config.baseURL + res.config.url,
    '// data :',
    res.config.data,
    '// params :',
    res.config.params,
  );
};

export const printErrorConsole = (error) => {
  if (error?.response) {
    console.log(
      'Interceptor error@@ : ',
      error.response?.data.apiStatus.apiCode,
      error.config.method,
      error.config.baseURL + error.config.url,
      '// data :',
      error.config.data,
    );
  } else {
    console.log('Interceptor error@@ : ', error);
  }
};
