import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import {
  colors,
  globalStyle,
  images,
  toSize,
} from '../../../config/globalStyle';
import MyIcon from '../../../config/icon-font';
import AppImage from '../../common/appImage';
import AppText from '../../common/appText';
import AppTouchable from '../../common/appTouchable';
import { image_small } from '../../../constants/imageSize';
import Config from 'react-native-config';
import Svg from '../../../asset/svg';

const GroupUserCard = ({ data, master, sub, iconPress, onPress, isDelete }) => {
  return (
    <View style={globalStyle.flexRow}>
      <AppTouchable style={styles.container} onPress={onPress}>
        {data.profileUrl ? (
          <AppImage
            source={{
              uri: `${Config.IMAGE_SERVER_URI}/${data.profileUrl}${image_small}`,
            }}
            icon={'profile_empty'}
            size={toSize(19)}
            color={colors.ColorAEE9D2}
            style={[styles.profile, master === data.mid && styles.master]}
          />
        ) : (
          <View
            style={[
              globalStyle.empty,
              styles.profile,
              master === data.mid && styles.master,
            ]}
          >
            <MyIcon
              name={'profile_empty'}
              size={toSize(19)}
              color={colors.ColorAEE9D2}
            />
          </View>
        )}
        <AppText style={styles.name} numberOfLines={1}>
          {data.name}
        </AppText>
      </AppTouchable>
      {data.mid === sub ? (
        <View style={styles.icon} />
      ) : (
        <AppTouchable
          style={styles.icon}
          disabled={isDelete && !data.follow}
          onPress={iconPress}
        >
          {sub === master ? (
            // <MyIcon
            //   size={toSize(24)}
            //   color={isDelete ? colors.ColorE5E5E5 : 'black'}
            //   name={'ic_etc_vertical'}
            // />
            Svg('ic_etc_sec')
          ) : (
            <>
              {isDelete ? (
                data.follow ? (
                  <MyIcon
                    name={'ic_star'}
                    size={toSize(20)}
                    color={colors.ColorFEE500}
                  />
                ) : (
                  Svg('ic_star_empty_delete')
                )
              ) : data.follow ? (
                <MyIcon
                  name={'ic_star'}
                  size={toSize(20)}
                  color={colors.ColorFEE500}
                />
              ) : (
                Svg('ic_star_empty')
              )}
            </>
          )}
        </AppTouchable>
      )}
    </View>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    height: toSize(64),
    marginLeft: toSize(16),
    paddingHorizontal: toSize(6),
    // borderWidth: 1,
    // borderColor: colors.ColorE5E5E5,
    alignItems: 'center',
  },
  name: {
    flex: 1,
  },
  profile: {
    width: toSize(42),
    height: toSize(42),
    borderRadius: 999,
    marginRight: toSize(12),
    backgroundColor: colors.ColorF0FFF9,
  },
  master: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  icon: {
    width: toSize(24),
    height: toSize(24),
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginRight: toSize(16),
    // borderWidth: 1,
    // borderColor: colors.ColorE5E5E5,
  },
});

export default GroupUserCard;
