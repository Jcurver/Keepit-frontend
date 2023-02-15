import React, { useState } from 'react';
import { TextInput, View } from 'react-native';
import {
  colors,
  fonts,
  globalStyle,
  toSize,
} from '../../../config/globalStyle';

const AppTextInput = ({
  boxStyle,
  size = 16,
  weight = 'regular',
  color = colors.black,
  letterSpacing = 0,
  placeholder,
  placeholderTextColor = colors.ColorC4C4C4,
  value,
  onChangeText,
  inputRef,
  style,
  ...props
}) => {
  const [focused, setFocused] = useState(false);

  let fontFamily = '';
  if (weight === 'medium') {
    fontFamily = fonts.SpoqaHanSansNeo_Medium;
  } else if (weight === 'bold') {
    fontFamily = fonts.SpoqaHanSansNeo_Bold;
  } else {
    fontFamily = fonts.SpoqaHanSansNeo_Regular;
  }

  return boxStyle ? (
    <View
      style={[
        globalStyle.textInputContainer,
        focused
          ? { borderColor: colors.Color2D2F30 }
          : { borderColor: colors.ColorE5E5E5 },
        boxStyle,
      ]}
    >
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        value={value}
        onFocus={() => setFocused(true)}
        onEndEditing={() => setFocused(false)}
        onChangeText={onChangeText}
        style={[
          {
            fontSize: toSize(size),
            fontFamily: fontFamily,
            color: color,
            letterSpacing: letterSpacing,
          },
          style,
        ]}
        ref={inputRef}
        autoCorrect={false}
        autoCapitalize={'none'}
        {...props}
      />
    </View>
  ) : (
    <TextInput
      placeholder={placeholder}
      placeholderTextColor={placeholderTextColor}
      value={value}
      onChangeText={onChangeText}
      style={[
        {
          fontSize: toSize(size),
          fontFamily: fontFamily,
          color: color,
          letterSpacing: letterSpacing,
        },
        style,
      ]}
      ref={inputRef}
      autoCorrect={false}
      autoCapitalize={'none'}
      {...props}
    />
  );
};

export default AppTextInput;
