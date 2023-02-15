import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import AppLoading from '../../common/appLoading';
import { screenWidth, toSize, colors } from '../../../config/globalStyle';
import { ImageRatio } from '../../../function/image';
import AppImage from '../../common/AppImage';

const FullImage = ({ uri, style }) => {
  const [width, setWidth] = useState(screenWidth - toSize(32));
  const [height, setHeight] = useState((screenWidth - toSize(32)) / 2);
  const [imgURI, setImgURI] = useState();
  const maxHeight =
    screenWidth - toSize(32) < 343 ? screenWidth - toSize(32) : 343;

  useEffect(() => {
    if (uri) {
      ImageRatio(
        'https://person.jjhserverworld.pe.kr/files/review/medium' + uri,
        setWidth,
        setHeight,
        maxHeight,
        null,
      );
      setImgURI(
        'https://person.jjhserverworld.pe.kr/files/review/medium' + uri,
      );
    } else {
      setImgURI(null);
    }
  }, [maxHeight, uri]);

  return (
    <View style={style}>
      <View style={[styles.container, { height: height }]}>
        {/* <AppLoading
          transparent
          indicatorColor={colors.black}
          style={{ width: maxHeight }}
        /> */}
        <AppImage
          source={{ uri: imgURI }}
          style={[styles.image, { width: width, height: height }]}
        />
      </View>
    </View>
  );
};

export default FullImage;

const styles = StyleSheet.create({
  container: {
    width: screenWidth - toSize(32),
  },
  image: {
    zIndex: 100,
  },
});
