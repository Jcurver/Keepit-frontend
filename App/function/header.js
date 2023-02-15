import { Animated } from 'react-native';

export const handleHeaderTranslate = (scrollY, headerHeight) => {
  const clampScroll = Animated.diffClamp(
    Animated.add(
      scrollY.interpolate({
        inputRange: [0, headerHeight],
        outputRange: [0, headerHeight],
        extrapolate: 'clamp',
      }),
      0,
    ),
    0,
    headerHeight,
  );

  const headerTranslateY = clampScroll.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [0, -headerHeight],
    extrapolate: 'clamp',
  });

  return headerTranslateY;
};

export const handleHeaderOpacity = (scrollY, headerHeight) =>
  scrollY.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

export const handleTitleOpacity = (scrollY, headerHeight) =>
  scrollY.interpolate({
    inputRange: [headerHeight - 1, headerHeight],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

export const initialScroll = (
  scrollY,
  headerHeight,
  scrollValue,
  clampScrollValue,
) => {
  scrollY.addListener((value) => {
    const diff = value - scrollValue;
    scrollValue = value;
    clampScrollValue = Math.min(
      Math.max(clampScrollValue * diff, 0),
      headerHeight,
    );
  });
};
