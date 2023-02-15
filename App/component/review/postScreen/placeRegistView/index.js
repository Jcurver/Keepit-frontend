import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import AppTouchable from '../../../common/appTouchable';
import AppText from '../../../common/appText';
import MyIcon from 'config/icon-font';
import { styles } from './style';
import { useNavigation } from '@react-navigation/native';
import { colors } from 'config/globalStyle';
import Svg from '../../../../asset/svg';
import { toSize } from '../../../../config/globalStyle';

const PlaceRegistView = ({
  form,
  isImageLoading,
  fromDetailScreen,
  nowPage,
}) => {
  const { navigate } = useNavigation();
  const [myPlace, setMyPlace] = useState('');
  const [myAddress, setMyAddress] = useState('');
  useEffect(() => {
    if (form.selectedPlace) {
      const { placeName, roadAddress, address } = JSON.parse(
        form.selectedPlace,
      );
      setMyPlace(placeName);
      setMyAddress(roadAddress !== '' ? roadAddress : address);
    }
  }, [form]);

  return (
    <>
      {form?.selectedPlace ? (
        <AppTouchable
          style={styles.selectedPlaceView}
          onPress={() => {
            if (!isImageLoading) {
              navigate('ReviewMapSearchScreen', {
                form,
                fromDetailScreen,
                nowPage,
              });
            }
          }}
        >
          <View style={styles.selectedPlace}>
            {Svg('mapPin')}
            <AppText size={16} style={styles.maringLeft}>
              {myPlace}
            </AppText>
          </View>
          <View style={styles.selectedAddress}>
            <AppText
              size={12}
              color={colors.Color6B6A6A}
              style={styles.pleaseSetPlaceText}
            >
              {myAddress}
            </AppText>
          </View>
        </AppTouchable>
      ) : (
        <AppTouchable
          style={styles.searchPlaceView}
          onPress={() => {
            if (!isImageLoading) {
              navigate('ReviewMapSearchScreen', { form, nowPage });
            }
          }}
        >
          <MyIcon
            name="ic_search"
            size={toSize(20)}
            color={colors.ColorC4C4C4}
          />
          <AppText
            size={16}
            style={styles.pleaseSetPlaceText}
            color={colors.ColorC4C4C4}
          >
            장소를 등록해주세요
          </AppText>
        </AppTouchable>
      )}
    </>
  );
};

export default PlaceRegistView;
