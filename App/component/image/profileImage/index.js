import React, { useEffect, useState } from 'react';
import { View, Image } from 'react-native';
import { styles } from './styles';
import AppTouchable from '../../common/appTouchable';
import { colors, images, toSize } from '../../../config/globalStyle';
import Svg from '../../../asset/svg';
import MyIcon from '../../../config/icon-font';
import AppImage from '../../common/appImage';
import { image_small } from '../../../constants/imageSize';
import Config from 'react-native-config';

const ProfileImage = ({
  style,
  size,
  data,
  imagePress,
  onPress,
  disabled = true,
  badge,
}) => {
  return (
    <View style={style}>
      <AppTouchable onPress={imagePress} disabled={disabled}>
        {data ? (
          <AppImage
            source={{
              uri: data.uri
                ? data.uri
                : `${Config.IMAGE_SERVER_URI}/${data}${image_small}`,
            }}
            style={styles.image}
          />
        ) : (
          <View style={styles.emptyProfile}>
            <MyIcon
              name={'profile_empty'}
              size={toSize(50)}
              color={colors.ColorAEE9D2}
            />
          </View>
        )}
      </AppTouchable>

      {badge && (
        <AppTouchable onPress={onPress}>
          <Image source={images.ic_addProfile} style={styles.button} />
        </AppTouchable>
      )}
    </View>
  );
};

export default ProfileImage;
