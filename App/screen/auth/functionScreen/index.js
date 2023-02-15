import React, { useState } from 'react';
import { LayoutAnimation, View } from 'react-native';
import AppText from '../../../component/common/appText';
import AppTouchable from '../../../component/common/appTouchable';
import { colors, toSize } from '../../../config/globalStyle';
import RootNavigation from '../../../RootNavigation';
import Screen from '../../Screen';
import { styles } from './styles';

import Swiper from 'react-native-swiper';
import Carousel from '../../../component/carosel';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '@gorhom/bottom-sheet';

const FunctionScreen = () => {
  const [visible, setvisible] = useState(false);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const PAGES = [
    {
      num: 1,
      mainText: '그룹을 만들어요',
      subText: '함께 공유하고 싶은 장소를 주제로',
      subText2: '그룹을 만들어요.',
      imageWidth: toSize(216.97),
      imageUrl: '../../asset/onboarding1.png',
      // color: '#86E3CE',
    },
    {
      num: 2,
      mainText: '장소 리뷰를 등록해요',
      subText: '그룹에 리뷰를 기록하고',
      subText2: '멤버들과 정보를 공유해요.',
      imageWidth: toSize(202.75),
      imageUrl: '../../asset/onboarding2.png',
      // color: '#D0E6A5',
    },
    {
      num: 3,
      mainText: '그룹 지도를 한눈에 볼 수 있어요',
      subText: '서로가 공유한 장소 위치를',
      subText2: '확인하고 찾아갈 수 있어요.',
      imageWidth: toSize(375),
      imageUrl: '../../asset/onboarding3.png',
      // color: '#FFDD94',
    },
    {
      num: 4,
      mainText: '마음에 드는 장소를 킵해요',
      subText: '언제 어디서든 고민 없이',
      subText2: '킵해둔 장소를 고를 수 있어요.',
      imageWidth: toSize(130.29),
      imageUrl: '../../asset/onboarding4.png',
      // color: '#FA897B',
    },
  ];
  const gap = 0;
  const offset = 0;
  return (
    <Screen topSafeAreaColor="white" bottomSafeAreaColor="white">
      {/* <Swiper
        style={styles.wrapper}
        //height={500}
        dot={
          <View
            backgroundColor={colors.ColorD9D9D9}
            style={{
              width: 11,
              height: 11,
              borderRadius: 7,
              marginLeft: 6,
              marginBottom: 60,
            }}
          />
        }
        activeDot={
          <View
            backgroundColor={colors.Color27508D}
            style={{
              width: 11,
              height: 11,
              borderRadius: 7,
              marginLeft: 6,
              marginBottom: 60,
            }}
          />
        }
        scrollEnabled={scrollEnabled}
        onMomentumScrollBegin={(e, state, context) => {
          // console.log('beginState', state.index, context.state);
        }}
        onMomentumScrollEnd={(e, state, context) => {
          // console.log('event', e.target, 'state', state, 'context', context);
          // console.log('state', state.index, context.state);
          // console.log('context', context);
        }}
        onTouchStart={(e, state, context) => {
          // console.log('capture', state.index, context.state);
        }}
        onTouchEnd={(e, state, context) => {
          console.log('End', state.index, context.state.index);
        }}
        onIndexChanged={() => {
          LayoutAnimation.easeInEaseOut();
        }}
      >
        <View style={styles.slide1}>
          <AppText style={styles.text}>서비스 기능1</AppText>
        </View>
        <View style={styles.slide2}>
          <AppText style={styles.text}>서비스 기능2</AppText>
        </View>
        <View style={styles.slide3}>
          <AppText style={styles.text}>서비스 기능3</AppText>
        </View>
        <View style={styles.slide4}>
          <AppText style={styles.text}>서비스 기능4</AppText>
        </View>
      </Swiper> */}
      <Carousel
        gap={gap}
        offset={offset}
        pages={PAGES}
        pageWidth={WINDOW_WIDTH - (gap + offset) * 2}
      />
      <View style={{ height: WINDOW_HEIGHT * 0.28, paddingTop: 40 }}>
        <AppTouchable
          button
          style={styles.start}
          onPress={() => RootNavigation.reset([{ name: 'Main' }])}
        >
          <AppText weight="bold" size={18} color={colors.white}>
            시작하기
          </AppText>
        </AppTouchable>
      </View>
    </Screen>
  );
};

export default FunctionScreen;
