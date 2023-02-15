import { WINDOW_WIDTH } from '@gorhom/bottom-sheet';
import React, {
  useState,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  runOnJS,
} from 'react-native-reanimated';
import { toSize } from '../config/globalStyle';

const Toast = forwardRef((props, ref) => {
  useEffect(() => {
    if (props.toastText) {
      ref?.current?.show(props.toastText);
    }
  }, [props.toastText, ref]);
  const [message, setMessage] = useState('');
  const toastOpacity = useSharedValue(0);
  const isShowed = useRef(false);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: toastOpacity.value,
    };
  }, []);

  useImperativeHandle(ref, () => ({ show }));

  const turnOnIsShow = useCallback(() => {
    isShowed.current = false;
  }, []);

  const show = useCallback(
    (message) => {
      setMessage(message);
      isShowed.current = true;
      toastOpacity.value = withSequence(
        withTiming(0.94, { duration: 300 }),
        withTiming(0.94, { duration: 1400 }),
        withTiming(0, { duration: 300 }, () => {
          runOnJS(turnOnIsShow)();
        }),
      );
    },
    [toastOpacity, turnOnIsShow],
  );
  if (!props.toastText) {
    return <></>;
  }

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.rootContainer,
        animatedStyle,
        props.toastMargin && { marginTop: toSize(40) },
      ]}
    >
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  rootContainer: {
    position: 'absolute',
    backgroundColor: 'rgb(47,47,47)',
    paddingVertical: toSize(9),
    width: WINDOW_WIDTH - toSize(44),
    marginLeft: toSize(22),
    borderRadius: toSize(6),
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 5,
    paddingHorizontal: toSize(-22),
  },
  message: {
    color: 'rgb(255, 255, 255)',
    fontSize: 12,
  },
});

export default Toast;
