import React from 'react';
import { Text } from 'react-native';
import { colors, fonts, toSize } from '../../../config/globalStyle';
import Skeleton from '../skeleton';

const AppText = ({
  size = 14,
  weight = 'regular',
  color = colors.black,
  letterSpacing = 0,
  style,
  children,
  lineHeight,
  isData = true,
  sWidth = undefined,
  sHeight = undefined,
  viewStyle,
  noStyle = false,
  testID = undefined,
  ...props
}) => {
  let fontFamily = '';
  if (weight === 'medium') {
    fontFamily = fonts.SpoqaHanSansNeo_Medium;
  } else if (weight === 'bold') {
    fontFamily = fonts.SpoqaHanSansNeo_Bold;
  } else {
    fontFamily = fonts.SpoqaHanSansNeo_Regular;
  }
  const defaultLineHeight = toSize(size) * 1.5;
  if (!isData) {
    return (
      <Skeleton
        width={sWidth ? sWidth : size * 7}
        height={sHeight ? sHeight : size}
        viewStyle={viewStyle}
        noStyle={noStyle}
      />
    );
  }

  return (
    <Text
      style={[
        {
          fontSize: toSize(size),
          fontFamily: fontFamily,
          color: color,
          letterSpacing: letterSpacing && letterSpacing,
          lineHeight: lineHeight ? lineHeight : defaultLineHeight,
        },
        style,
      ]}
      testID={testID}
      {...props}
    >
      {children && children}
    </Text>
  );
};

export default AppText;
