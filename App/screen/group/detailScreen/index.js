import React, { useEffect } from 'react';
import AppHeader from '../../../component/common/appHeader';
import RootNavigation from '../../../RootNavigation';
import Screen from '../../Screen';
import { get } from 'lodash';
import MyIcon from '../../../config/icon-font';
import { toSize, colors, images } from '../../../config/globalStyle';
import { Image, View } from 'react-native';
import { styles } from './styles';
import AppText from '../../../component/common/appText';
import { typeTranslation } from '../../../function/etc';
import Svg from '../../../asset/svg';
import AppImage from '../../../component/common/appImage';
import { image_medium } from '../../../constants/imageSize';
import Config from 'react-native-config';

const GroupDetailScreen = ({ route }) => {
  const data = get(route, 'params.data');

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <Screen>
      <AppHeader
        leftIcon={Svg('back_thin')}
        leftIconPress={() => RootNavigation.goBack()}
      />
      <AppImage
        source={{
          uri: `${Config.IMAGE_SERVER_URI}/${data?.profileUrl}${image_medium}`,
        }}
        style={styles.groupProfile}
        size={19}
      />
      <AppText size={16} style={{ alignSelf: 'center' }}>
        {data.name}
      </AppText>
      <View style={styles.infoContainer}>
        <View style={styles.info}>
          <AppText style={{ width: toSize(74) }} color={colors.Color6B6A6A}>
            생성일
          </AppText>
          <AppText>
            {data?.createDt.substring(0, 10).replaceAll('-', '.')}
          </AppText>
        </View>
        <View style={styles.info}>
          <AppText style={{ width: toSize(74) }} color={colors.Color6B6A6A}>
            카테고리
          </AppText>
          <AppText>{typeTranslation(data.category)}</AppText>
        </View>
        <View style={styles.info}>
          <AppText style={{ width: toSize(74) }} color={colors.Color6B6A6A}>
            설명
          </AppText>
          <AppText style={{ flex: 1 }}>{data.description}</AppText>
        </View>
      </View>
    </Screen>
  );
};

export default GroupDetailScreen;
