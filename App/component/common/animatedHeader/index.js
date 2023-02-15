import React from 'react';
import { Animated, StyleSheet } from 'react-native';
import {
  handleHeaderOpacity,
  handleHeaderTranslate,
} from '../../../function/header';

const AnimatedHeader = ({
  style,
  headerHeight,
  translateHeight = headerHeight,
  scrollY,
  opacity = true,
  children,
}) => {
  const headerTranslateY = handleHeaderTranslate(scrollY, translateHeight);
  const headerOpacity = handleHeaderOpacity(scrollY, translateHeight);

  return (
    <Animated.View
      style={[
        style,
        styles.container,
        {
          height: headerHeight,
          transform: [{ translateY: headerTranslateY }],
        },
        opacity && { opacity: headerOpacity },
      ]}
    >
      {children}
    </Animated.View>
  );
};

export default AnimatedHeader;

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 1,
  },
});
