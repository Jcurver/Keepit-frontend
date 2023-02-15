import React from 'react';
import { colors, screenWidth, toSize } from '../../../config/globalStyle';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActionSheetIOS, Linking, StyleSheet, View } from 'react-native';
import AppText from '../../../component/common/appText';
import { WINDOW_WIDTH } from '@gorhom/bottom-sheet';
import Svg from '../../../asset/svg';
import AppTouchable from '../../../component/common/appTouchable';
import RootNavigation from '../../../RootNavigation';
import AppImage from '../../../component/common/appImage';
import { image_small } from '../../../constants/imageSize';
import Config from 'react-native-config';
import { useSelector } from 'react-redux';
import { callApi } from '../../../function/auth';
import { postPlace } from '../../../api/place';
import { useEffect } from 'react';

const BottomSheet = ({ bottomSheetData, isGroupDelete }) => {
  console.log('bottomSheetData?.imageUrl:: ', bottomSheetData?.imageUrl);
  const insets = useSafeAreaInsets();
  const ids = useSelector((state) => state.user.ids);
  console.log('bottomSheetData:: ', bottomSheetData);
  console.log('ids:: ', ids);

  const phoneChoice = ['닫기', '전화걸기 ' + bottomSheetData.phone];
  const tabPhone = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: phoneChoice,
        cancelButtonIndex: 0,
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          console.log('cancel');
        } else if (buttonIndex === 1) {
          // eslint-disable-next-line no-useless-escape
          Linking.openURL(`tel:${bottomSheetData.phone.replace(/\-/g, '')}`);
        }
      },
    );
  };
  let categoryNameArr = bottomSheetData?.categoryName?.split(' > ');

  useEffect(() => {
    if (bottomSheetData) {
      let bottomSheetDataTemp = { ...bottomSheetData };
      delete bottomSheetDataTemp.type;
      callApi(postPlace, bottomSheetDataTemp, () => {});
    }
  }, [bottomSheetData]);

  return (
    <View
      style={[
        styles.bottomSheetContainer,
        { height: toSize(223) + insets.bottom },
      ]}
    >
      <AppText numberOfLines={1}>
        <AppText weight="medium" size={20}>
          {bottomSheetData.placeName}
        </AppText>{' '}
        {'  '}
        <AppText size={12} color={colors.Color6B6A6A}>
          {categoryNameArr ? categoryNameArr[categoryNameArr.length - 1] : ''}
        </AppText>
      </AppText>
      <AppText size={12} color={colors.Color6B6A6A}>
        {bottomSheetData.roadAddress
          ? bottomSheetData.roadAddress
          : bottomSheetData.address}
      </AppText>
      <AppTouchable
        onPress={() => {
          if (bottomSheetData.phone) {
            tabPhone();
          }
        }}
      >
        <AppText
          size={12}
          color={bottomSheetData.phone ? colors.primary : colors.ColorA7A7A7}
        >
          {bottomSheetData.phone ? bottomSheetData.phone : '전화번호 미제공'}
        </AppText>
      </AppTouchable>
      <View style={styles.bottomContentContainer}>
        <View style={styles.imageView}>
          {bottomSheetData?.imageUrl ? (
            <AppImage
              source={{
                uri: `${Config.IMAGE_SERVER_URI}/${bottomSheetData.imageUrl}${image_small}`,
              }}
              style={{
                width: toSize(93),
                height: toSize(93),
                borderRadius: toSize(4),
              }}
              alt=""
            />
          ) : (
            Svg('no_img')
          )}
        </View>

        <View style={styles.buttonContainer}>
          <AppTouchable
            style={[styles.buttonText, { marginRight: toSize(8) }]}
            onPress={() => {
              RootNavigation.navigate('MapWebScreen', {
                placeId: bottomSheetData.placeId,
              });
            }}
          >
            <View style={[styles.buttonCircle, { backgroundColor: '#FAFAFA' }]}>
              {Svg('roadSearch')}
            </View>
            <AppText>길안내</AppText>
          </AppTouchable>
          <AppTouchable
            onPress={() => {
              if (!isGroupDelete) {
                RootNavigation.navigate('ReviewPostScreen', {
                  bottomSheetData,
                  fromScreen: 'MapScreen',
                });
              }
            }}
            style={[styles.buttonText, { marginRight: toSize(8) }]}
          >
            <View style={styles.buttonCircle}>
              {isGroupDelete
                ? Svg('review_write_gray')
                : Svg('review_write_primary')}
            </View>
            <AppText color={isGroupDelete && colors.ColorC4C4C4}>
              리뷰 쓰기
            </AppText>
          </AppTouchable>
          <AppTouchable
            style={styles.buttonText}
            onPress={() =>
              RootNavigation.push('ReviewListScreen', {
                placeId: bottomSheetData.placeId,
                groupId: ids.groupId,
                placeName: bottomSheetData.placeName,
              })
            }
          >
            <View style={styles.buttonCircle}>{Svg('review_read')}</View>
            <AppText>리뷰 보기</AppText>
          </AppTouchable>
        </View>
      </View>
    </View>
  );
};
export default BottomSheet;

const styles = StyleSheet.create({
  bottomSheetContainer: {
    position: 'absolute',
    width: WINDOW_WIDTH + 3,
    // height: toSize(223.23),
    backgroundColor: 'white',
    bottom: 0,
    borderTopRightRadius: toSize(24),
    borderTopLeftRadius: toSize(24),
    paddingVertical: toSize(24),
    paddingHorizontal: toSize(16),
  },
  bottomContentContainer: {
    marginTop: toSize(16),
    flexDirection: 'row',
  },
  imageView: {
    width: toSize(93),
    height: toSize(93),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.ColorC4C4C4,
    borderRadius: toSize(4),
  },
  buttonContainer: {
    marginTop: toSize(20),
    flexDirection: 'row',
  },
  buttonText: {
    height: toSize(73),
    width: toSize(79),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonCircle: {
    width: toSize(48),
    height: toSize(48),
    borderRadius: 999,
    backgroundColor: '#F0FFF9',
    marginBottom: toSize(4),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
