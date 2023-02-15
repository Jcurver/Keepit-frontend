import React, { memo, useState } from 'react';
import { Image, View } from 'react-native';
import { colors, globalStyle } from '../../../config/globalStyle';
import MyIcon from '../../../config/icon-font';

const imageSource = ({ source, noImage, type, defaultSource }) => {
  if (source && !noImage) {
    return source;
  } else if (noImage) {
    if (defaultSource) {
      return defaultSource;
    } else {
      switch (type) {
        case 'profile':
          return require('../../../asset/profile/avatar64.png');
      }
    }
  } else {
    return undefined;
  }
};

const AppImage = ({
  source,
  style,
  noImage = false,
  defaultSource = undefined,
  type = undefined,
  icon,
  size,
  color,
  ...props
}) => {
  const [isError, setIsError] = useState(false);

  return isError ? (
    <View style={[globalStyle.empty, style]}>
      <MyIcon
        name={icon ? icon : 'keepit_logo'}
        size={size}
        color={color ? color : colors.ColorF4F4F4}
      />
    </View>
  ) : (
    <Image
      style={style}
      source={imageSource({ source, noImage, type, defaultSource })}
      onError={({ nativeEvent: { error } }) => {
        // console.log('IMAGE ERROR', error);
        setIsError(true);
      }}
      defaultSource={
        defaultSource
          ? defaultSource
          : require('../../../asset/loadingImage.png')
      }
      {...props}
    />
  );
};
export default AppImage;
