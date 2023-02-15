import { StackActions } from '@react-navigation/native';
import * as React from 'react';

export const navigationRef = React.createRef();
const isMountedRef = React.createRef();
const routeNameRef = React.createRef();

export const navigate = (name, params) => {
  if (isMountedRef.current) {
    navigationRef.current?.navigate(name, params);
  }
};

export const reset = (routes) => {
  navigationRef.current?.reset({
    index: 1,
    routes,
  });
};

export const goBack = () => {
  navigationRef.current?.goBack();
};

export const push = (name, params) => {
  navigationRef.current.dispatch(StackActions.push(name, params));
};

const getActiveRouteName = (_state = null) => {
  const state = _state !== null ? _state : getRootState();
  const route = state.routes[state.index];

  if (route.state) {
    // Dive into nested navigators
    return getActiveRouteName(route.state);
  }

  return route.name;
};

const getRootState = () => {
  return navigationRef.current?.getRootState();
};

export default {
  isMountedRef,
  navigationRef,
  navigate,
  goBack,
  push,
  reset,
  getActiveRouteName,
  getRootState,
  routeNameRef,
};
