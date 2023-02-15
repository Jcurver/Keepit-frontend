import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { toSize } from '../../../config/globalStyle';

export const AppTouchable = ({
  style,
  onPress,
  opacity = 0.9,
  button,
  children,
  ...props
}) => {
  const Button = (
    <TouchableOpacity
      style={[styles.button, style && style]}
      onPress={onPress}
      activeOpacity={opacity}
      {...props}
    >
      {children}
    </TouchableOpacity>
  );

  const Touchable = (
    <TouchableOpacity
      style={[styles.touchable, style && style]}
      onPress={onPress}
      activeOpacity={opacity}
      {...props}
    >
      {children}
    </TouchableOpacity>
  );

  return button ? Button : Touchable;
};

export default AppTouchable;

const styles = StyleSheet.create({
  touchable: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  button: {
    borderRadius: 6,
    height: toSize(56),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
