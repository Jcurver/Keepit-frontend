import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import {
  colors,
  globalStyle,
  images,
  toSize,
} from '../../../config/globalStyle';
import AppText from '../../common/appText';
import AppTouchable from '../../common/appTouchable';
import RootNavigation from '../../../RootNavigation';
import AppImage from '../../common/appImage';
import MyIcon from '../../../config/icon-font';
import { image_medium } from '../../../constants/imageSize';
import Config from 'react-native-config';

const GroupHeader = ({ data }) => {
  return (
    <View style={styles.collapsible}>
      {data?.profileUrl ? (
        <AppImage
          source={{
            uri: `${Config.IMAGE_SERVER_URI}/${data?.profileUrl}${image_medium}`,
          }}
          size={toSize(19)}
          style={styles.groupProfile}
        />
      ) : (
        <View style={[globalStyle.empty, styles.groupProfile]}>
          <MyIcon
            name={'keepit_logo'}
            size={toSize(19)}
            color={colors.ColorF4F4F4}
          />
        </View>
      )}
      <AppText size={16}>{data?.name}</AppText>
      <AppTouchable
        style={{ marginTop: toSize(5) }}
        onPress={() =>
          RootNavigation.navigate('GroupDetailScreen', { data: data })
        }
      >
        <AppText color={colors.Color6B6A6A}>더보기</AppText>
      </AppTouchable>
    </View>
  );
};

export const styles = StyleSheet.create({
  collapsible: {
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupProfile: {
    marginTop: toSize(12),
    marginBottom: toSize(12),
    width: toSize(96),
    height: toSize(96),
    borderRadius: 999,
  },
});

export default GroupHeader;
