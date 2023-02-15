import React, { useEffect, useState, memo } from 'react';
import {
  Platform,
  NativeModules,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
const { StatusBarManager } = NativeModules;
const AppKeyboardAvoidingView = ({
  children = null,
  aosOffset = 0,
  alwaysVisibleFeature = false,
}) => {
  const [statusBarHeight, setStatusBarHeight] = useState(0);
  useEffect(() => {
    if (Platform.OS === 'ios') {
      StatusBarManager.getHeight((statusBarFrameData) => {
        setStatusBarHeight(statusBarFrameData.height);
      });
    }
  }, []);

  const [isKeyboardShow, setIsKeyboardShow] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardShow(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardShow(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [isKeyboardShow]);

  return (
    <>
      <KeyboardAwareScrollView />
      <KeyboardAvoidingView
        keyboardVerticalOffset={
          Platform.OS === 'ios' ? statusBarHeight : aosOffset
        }
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {isKeyboardShow || alwaysVisibleFeature ? children && children : <></>}
      </KeyboardAvoidingView>
    </>
  );
};
export default AppKeyboardAvoidingView;
