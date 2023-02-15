import React, { useCallback, useEffect, useRef, useState } from 'react';
import AppHeader from '../../../component/common/appHeader';
import RootNavigation from '../../../RootNavigation';
import Screen from '../../Screen';
import MyIcon from '../../../config/icon-font';
import { get, set } from 'lodash';
import { callApi } from '../../../function/auth';
import { getGroupsHome } from '../../../api/group';
import { colors, globalStyle, toSize } from '../../../config/globalStyle';
import AnimatedHeader from '../../../component/common/animatedHeader';
import { initialScroll } from '../../../function/header';
import { Animated, View } from 'react-native';
import { styles } from './styles';
import AppText from '../../../component/common/appText';
import GroupTab from '../../../component/group/tab';
import AppTouchable from '../../../component/common/appTouchable';
import GroupMainList from '../../../component/group/mainList';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { setIds } from '../../../store/feature/userSlice';
import messaging from '@react-native-firebase/messaging';
import updateSameText from '../../../function/updateSameText';
import Svg from '../../../asset/svg';

const GroupHomeScreen = ({ route }) => {
  const dispatch = useDispatch();
  const groupId = get(route, 'params.groupId');
  const previousToastText = get(route, 'params.toastText');
  let isRefresh = get(route, 'params.isRefresh');
  const [data, setData] = useState();
  console.log('isRefresh:: ', isRefresh);
  console.log('GroupHomeData:: ', data);
  const [type, setType] = useState('리뷰');
  const [toastText, setToastText] = useState('test');
  const [doRefresh, setDoRefresh] = useState(false);
  const [reviewCount, setReviewCount] = useState();
  const [dailyCount, setDailyCount] = useState();
  const [quit, setQuit] = useState(false);

  useEffect(() => {
    setToastText((text) => updateSameText(route.params.toastText, text));
  }, [route]);

  const tabData = [
    { title: '리뷰', onPress: () => setType('리뷰'), active: type === '리뷰' },
    { title: '일상', onPress: () => setType('일상'), active: type === '일상' },
  ];

  const reviewScrollY = useRef(new Animated.Value(0)).current;
  const dailyScrollY = useRef(new Animated.Value(0)).current;
  const scrollY = type === '리뷰' ? reviewScrollY : dailyScrollY;
  const collapsibleHeaderHeight = toSize(75);
  const tabHeight = toSize(57);
  let clampScrollValue = 0;
  let scrollValue = 0;

  useEffect(() => {
    if (type === '리뷰' && dailyScrollY) {
      dailyScrollY.setValue(0);
    } else if (type === '일상' && reviewScrollY) {
      reviewScrollY.setValue(0);
    }
  }, [dailyScrollY, reviewScrollY, type]);

  useEffect(() => {
    if (previousToastText) {
      setToastText(previousToastText);
    }
    dispatch(
      setIds({ groupName: data?.groupName, groupId: route?.params?.groupId }),
    );
  }, [data, route?.params?.groupId, dispatch, previousToastText]);

  useEffect(() => {
    const requestUserPermission = async () => {
      await messaging().requestPermission();
    };
    requestUserPermission();
  }, []);

  useFocusEffect(
    useCallback(() => {
      // console.log('route.params?.isRefresh:: ', route.params?.isRefresh)
      if (isRefresh) {
        setDoRefresh(true);
      }
      callApi(getGroupsHome, groupId, handleGroup);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isRefresh]),
  );
  useEffect(() => {
    if (route.params?.isRefresh) {
      setDoRefresh(true);
    }
  }, [route]);

  useEffect(() => {
    if (
      clampScrollValue > -1 &&
      collapsibleHeaderHeight &&
      scrollValue > -1 &&
      scrollY > -1
    ) {
      initialScroll(
        scrollY,
        collapsibleHeaderHeight,
        scrollValue,
        clampScrollValue,
      );
    }
  }, [clampScrollValue, collapsibleHeaderHeight, scrollValue, scrollY]);

  const handleGroup = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      setData(res.data.data);
      console.log('DATAAA', res.data.data);
    } else if (res.data.apiStatus.apiCode === 826) {
      setQuit(true);
    }
  };
  const moveToPostReview = () => {
    RootNavigation.navigate('ReviewPostScreen', {
      groupId: groupId,
      groupName: data.groupName,
      fromScreen: 'GroupHomeScreen',
    });
  };
  const moveToPostDaily = () => {
    RootNavigation.navigate('DailyPostScreen', {
      groupId: groupId,
      fromScreen: 'GroupHomeScreen',
    });
  };

  return (
    <Screen toastText={toastText}>
      <AppHeader
        style={{ backgroundColor: 'white' }}
        leftIcon={Svg('back_thin')}
        leftIconPress={() => RootNavigation.goBack()}
        rightIcon={!quit && Svg('ic_location')}
        rightIconPress={() => {
          RootNavigation.navigate('ReviewMapScreen', { groupId });
        }}
        title={!quit && data?.groupName}
      />
      {quit ? (
        <View style={styles.quit}>
          {Svg('exclamation_mark')}
          <AppText
            size={16}
            color={colors.Color6B6A6A}
            style={{ marginTop: toSize(24) }}
          >
            {'탈퇴한 그룹이에요.\n이용 권한이 없어요.'}
          </AppText>
        </View>
      ) : (
        <>
          <AnimatedHeader
            style={{ marginTop: toSize(42), backgroundColor: 'white' }}
            headerHeight={collapsibleHeaderHeight}
            translateHeight={toSize(42)}
            scrollY={scrollY}
          >
            <AppTouchable
              style={styles.headerContainer}
              onPress={() => {
                RootNavigation.navigate('GroupInfoScreen', {
                  groupId,
                  fromScreen: 'GroupHomeScreen',
                });
              }}
            >
              <View style={styles.green} />
              <View style={styles.info}>
                <View style={styles.menu}>
                  <AppText size={12}>멤버</AppText>
                  <AppText weight={'medium'} size={14}>
                    {data?.memberCount}
                  </AppText>
                </View>
                <View style={styles.menu}>
                  <AppText size={12}>내 리뷰</AppText>
                  <AppText weight={'medium'} size={14}>
                    {data?.myReviewCount}
                  </AppText>
                </View>
              </View>
            </AppTouchable>
          </AnimatedHeader>

          <AnimatedHeader
            style={{ marginTop: toSize(42) + collapsibleHeaderHeight }}
            headerHeight={tabHeight}
            translateHeight={collapsibleHeaderHeight}
            scrollY={scrollY}
            opacity={0}
          >
            <GroupTab
              tabData={tabData}
              reviewCount={reviewCount}
              dailyCount={dailyCount}
            />
          </AnimatedHeader>

          {['리뷰', '일상'].map((item, index) => {
            return (
              <GroupMainList
                data={data}
                isDelete={data?.isDelete}
                isRefresh={doRefresh}
                setDoRefresh={setDoRefresh}
                setToastText={setToastText}
                fromHome={true}
                key={`groupInfo_${index}`}
                visible={type === item}
                type={item}
                tabData={tabData}
                scrollY={scrollY}
                groupId={groupId}
                reviewCount={reviewCount}
                dailyCount={dailyCount}
                setReviewCount={setReviewCount}
                setDailyCount={setDailyCount}
                collapsibleHeaderHeight={collapsibleHeaderHeight}
              />
            );
          })}

          <AppTouchable
            style={[
              styles.button,
              data?.isDelete ? styles.noShadow : styles.shadow,
            ]}
            disabled={data?.isDelete}
            onPress={() => {
              type === '리뷰' ? moveToPostReview() : moveToPostDaily();
            }}
          >
            <MyIcon size={toSize(24)} color={colors.white} name={'ic_write'} />
          </AppTouchable>
        </>
      )}
    </Screen>
  );
};

export default GroupHomeScreen;
