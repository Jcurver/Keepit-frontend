import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import AppText from '../../../component/common/appText';
import AppTouchable from '../../../component/common/appTouchable';
import AppHeader from '../../../component/common/appHeader';
import AppTextInput from '../../../component/common/appTextInput';
import { colors, toSize, images } from '../../../config/globalStyle';
import RootNavigation from '../../../RootNavigation';
import Screen from '../../Screen';
import { styles } from './styles';
import Svg from '../../../asset/svg';

const ReceiveScreen = () => {
  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.checkContainer}>{Svg('ic_check')}</View>

        <AppText size={20} weight={'medium'}>
          문의가 접수 되었습니다.
        </AppText>

        <AppText size={16} color={colors.Color6B6A6A} style={styles.contect}>
          {'문의하신 내용을 확인 후\n최대한 빠른 시일 내로 답변드리겠습니다.'}
        </AppText>
      </View>
      <AppTouchable
        button
        style={styles.queryButton}
        onPress={() => {
          RootNavigation.reset([{ name: 'IntroScreen' }]);
        }}
      >
        <AppText size={16} weight={'bold'} color={colors.white}>
          확인
        </AppText>
      </AppTouchable>
    </Screen>
  );
};

export default ReceiveScreen;
