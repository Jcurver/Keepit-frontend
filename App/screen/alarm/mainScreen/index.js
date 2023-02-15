import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import AppText from '../../../component/common/appText';
import AppTouchable from '../../../component/common/appTouchable';
import Screen from '../../Screen';
import AppHeader from '../../../component/common/appHeader';
import Svg from '../../../asset/svg';
import { StyleSheet } from 'react-native';
import { colors, toSize } from '../../../config/globalStyle';
import RootNavigation from '../../../RootNavigation';
import AlarmScrollView from '../../../component/alarm/alarmScrollView';
import { WINDOW_HEIGHT } from '@gorhom/bottom-sheet';
import ActivityCard from '../../../component/alarm/card/activityCard';
import NewsCard from '../../../component/alarm/card/newsCard';
import {
  getAlarmCheck,
  getAlarmMain,
  getAlarmNewsMain,
} from '../../../api/notification';
import { callApi } from '../../../function/auth';
import updateSameText from '../../../function/updateSameText';
import { useDispatch } from 'react-redux';
import { setIsNewAlarm } from '../../../store/feature/alertSlice';

export const navToScreenFromAlarm = (data, inApp = false) => {
  console.log('ALARM DATA:: ', data);
  // 그룹 멤버 참여 알림
  if (data?.notificationType === 'KPS_GJ') {
    RootNavigation.navigate('GroupInfoScreen', {
      fromScreen: 'AlarmMainScreen',
      alarmData: data,
      groupId: data?.groupId,
      alarmType: data?.notificationType,
    });
  } else if (
    // 그룹 새 리뷰 글 알림
    data?.notificationType === 'KPS_GNR' ||
    // 내 리뷰 글 댓글 알림
    data?.notificationType === 'KPS_MRC' ||
    // 내 리뷰 킵 알림
    data?.notificationType === 'KPS_MRK'
  ) {
    RootNavigation.navigate('ReviewDetailScreen', {
      fromScreen: 'AlarmMainScreen',
      alarmData: data,
      alarmType: data?.notificationType,
    });
  } else if (
    // 그룹 새 일상 글 알림
    data?.notificationType === 'KPS_GND' ||
    // 내 일상 글 댓글 알림
    data?.notificationType === 'KPS_MDC'
  ) {
    RootNavigation.navigate('DailyDetailScreen', {
      fromScreen: 'AlarmMainScreen',
      alarmData: data,
      alarmType: data?.notificationType,
    });
    // 나를 팔로잉 알림
  } else if (data?.notificationType === 'KPS_MFW') {
    return;
    // 마케팅 알림
  } else if (data?.notificationType === 'KPS_MKT') {
    return;
    //팔로워 새 글 알림
  } else if (data?.notificationType === 'KPS_FCR') {
    if (inApp) {
      data?.reviewId
        ? RootNavigation.navigate('ReviewDetailScreen', {
            fromScreen: 'AlarmMainScreen',
            alarmData: data,
            alarmType: data?.notificationType,
          })
        : RootNavigation.navigate('DailyDetailScreen', {
            fromScreen: 'AlarmMainScreen',
            alarmData: data,
            alarmType: data?.notificationType,
          });
    } else {
      data?.notiType === 'R'
        ? RootNavigation.navigate('ReviewDetailScreen', {
            fromScreen: 'AlarmMainScreen',
            alarmData: { ...data, reviewId: data?.contentsId },
            alarmType: data?.notificationType,
          })
        : RootNavigation.navigate('DailyDetailScreen', {
            fromScreen: 'AlarmMainScreen',
            alarmData: { ...data, dailyId: data?.contentsId },
            alarmType: data?.notificationType,
          });
    }
  } else if (data?.notificationType === 'KPS_FCR') {
    return;
    // 답댓글 알림
  } else if (data?.notificationType === 'KPS_MCC') {
    if (inApp) {
      data?.reviewId
        ? RootNavigation.navigate('ReviewDetailScreen', {
            fromScreen: 'AlarmMainScreen',
            alarmData: data,
            alarmType: data?.notificationType,
          })
        : RootNavigation.navigate('DailyDetailScreen', {
            fromScreen: 'AlarmMainScreen',
            alarmData: data,
            alarmType: data?.notificationType,
          });
    } else {
      data?.notiType === 'R'
        ? RootNavigation.navigate('ReviewDetailScreen', {
            fromScreen: 'AlarmMainScreen',
            alarmData: {
              ...data,
              reviewId: data?.contentsId,
              commentId: data?.targetCommentId,
            },
            alarmType: data?.notificationType,
          })
        : RootNavigation.navigate('DailyDetailScreen', {
            fromScreen: 'AlarmMainScreen',
            alarmData: {
              ...data,
              dailyId: data?.contentsId,
              commentId: data?.targetCommentId,
            },
            alarmType: data?.notificationType,
          });
    }
  } else if (data?.notificationType === 'KPS_GD') {
    RootNavigation.navigate('GroupHomeScreen', {
      groupId: data?.groupId,
      isRefresh: true,
    });
  } else {
    return;
  }
};

const AlarmMainScreen = ({ navigation, route: { params } }) => {
  const dispatch = useDispatch();
  const [isTabLeft, setIsTabLeft] = useState(true);
  const [toastText, setToastText] = useState();
  const [alarmData, setAlarmData] = useState([]);
  const [newsData, setNewsData] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [nextOffset, setNextOffset] = useState('firstPage');
  const [nextNewsOffset, setNextNewsOffset] = useState('firstPage');
  const [isLastPage, setIsLastPage] = useState(false);
  const [isLastNewsPage, setIsLastNewsPage] = useState(false);
  const [isBottomTabMount, setIsBottomTabMount] = useState(false);
  const getAlarmSuccess = (res) => {
    if (nextOffset === res?.data?.data?.nextOffset) {
      setIsLastPage(true);
      return;
    }
    if (res.data.apiStatus.apiCode === 200) {
      if (nextOffset === 'firstPage') {
        setAlarmData([...res.data.data.notificationList]);
      } else {
        setAlarmData((data) => [...data, ...res.data.data.notificationList]);
      }
      setNextOffset(res?.data?.data?.nextOffset);
      setIsDataLoading(false);
    }
  };

  const getAlarmNewsSuccess = (res) => {
    if (nextNewsOffset === res.data.data.nextOffset) {
      setIsLastNewsPage(false);
      return;
    }
    if (res.data.apiStatus.apiCode === 200) {
      if (nextNewsOffset === 'firstPage') {
        setNewsData([...res.data.data.notificationList]);
      } else {
        setNewsData((data) => [...data, ...res.data.data.notificationList]);
      }
      setNextNewsOffset(res?.data?.data?.nextOffset);
      setIsDataLoading(true);
    }
  };
  const getAlarmNextPage = () => {
    if (!isLastPage) {
      callApi(getAlarmMain, { nextOffset: 20 }, getAlarmSuccess);
    }
  };

  const getNewsNextPage = () => {
    if (!isLastNewsPage) {
      callApi(getAlarmNewsMain, { nextOffset: 20 }, getAlarmNewsSuccess);
    }
  };
  const alarmCheckSuccess = (res) => {
    if (res.data.apiStatus.apiCode !== 200) {
      return;
    }
    const { act, news } = res.data.data;
    if (!act && news) {
      callApi(
        getAlarmNewsMain,
        { nextOffset: 'firstPage' },
        getAlarmNewsSuccess,
      );
      setIsTabLeft(false);
    } else {
      callApi(getAlarmMain, { nextOffset: 'firstPage' }, getAlarmSuccess);
      setIsTabLeft(true);
    }
  };

  useEffect(() => {
    const focusEvent = navigation.addListener('focus', () => {
      setIsDataLoading(true);
      setIsBottomTabMount(true);
      setAlarmData([]);
      dispatch(setIsNewAlarm(false));
      callApi(getAlarmCheck, {}, alarmCheckSuccess);
    });
    return () => navigation.removeListener(focusEvent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (params?.toastText && isBottomTabMount) {
      setToastText((text) => updateSameText(params.toastText, text));
    }
    if (params?.backgroundAlarmData && isBottomTabMount) {
      navToScreenFromAlarm(params?.backgroundAlarmData);
    }
  }, [params?.backgroundAlarmData, params?.toastText, isBottomTabMount]);

  const alarmRefresh = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      setAlarmData(() => [...res.data.data.notificationList]);
      setNextOffset(res.data.data.nextOffset);
    }
  };

  const newsRefresh = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      console.log('RES', res.data.data.notificationList);
      setNewsData(() => [...res.data.data.notificationList]);
      setNextNewsOffset(res.data.data.nextOffset);
    }
  };

  const onRefresh = () => {
    if (isTabLeft) {
      callApi(getAlarmMain, { nextOffset: 'firstPage' }, alarmRefresh);
    } else {
      callApi(getAlarmNewsMain, { nextOffset: 'firstPage' }, newsRefresh);
    }
  };

  return (
    <Screen topSafeAreaColor={'white'} toastText={toastText}>
      <AppHeader
        title="알림"
        style={styles.headerStyle}
        rightIcon={Svg('settings')}
        rightIconPress={() => RootNavigation.navigate('AlarmSettingScreen')}
      />
      <View style={styles.tabView}>
        <AppTouchable
          style={styles.tab}
          onPress={() => {
            if (!isTabLeft) {
              callApi(getAlarmMain, { nextOffset: 'firstPage' }, alarmRefresh);
              setIsTabLeft(true);
            }
          }}
        >
          <AppText
            weight="bold"
            size={16}
            color={isTabLeft ? colors.Color191919 : colors.ColorA7A7A7}
          >
            활동
          </AppText>
        </AppTouchable>
        <AppTouchable
          style={styles.tab}
          onPress={() => {
            if (isTabLeft) {
              callApi(
                getAlarmNewsMain,
                { nextOffset: 'firstPage' },
                newsRefresh,
              );
              setIsTabLeft(false);
            }
          }}
        >
          <AppText
            weight="bold"
            size={16}
            color={!isTabLeft ? colors.Color191919 : colors.ColorA7A7A7}
          >
            소식
          </AppText>
        </AppTouchable>
      </View>
      <View style={styles.grayline}>
        <View
          style={[styles.blackline, isTabLeft ? styles.left : styles.right]}
        />
      </View>
      <ScrollView
        style={styles.scrollView}
        scrollEventThrottle={0}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={onRefresh} />
        }
        onScroll={(e) => {
          let paddingToBottom = 200;
          paddingToBottom += e.nativeEvent.layoutMeasurement.height;
          // console.log(Math.floor(paddingToBottom) + "-" + Math.floor(e.nativeEvent.contentOffset.y) + "-" + Math.floor(e.nativeEvent.contentSize.height));
          if (
            isTabLeft &&
            nextOffset !== undefined &&
            e.nativeEvent.contentOffset.y + paddingToBottom >=
              e.nativeEvent.contentSize.height
          ) {
            getAlarmNextPage();
          }
          if (
            !isTabLeft &&
            nextNewsOffset !== undefined &&
            e.nativeEvent.contentOffset.y + paddingToBottom >=
              e.nativeEvent.contentSize.height
          ) {
            getNewsNextPage();
          }
        }}
      >
        {alarmData?.length > 0 && isTabLeft ? (
          alarmData?.map((data, index) => (
            <AppTouchable
              key={index}
              onPress={() => navToScreenFromAlarm(data, true)}
            >
              <ActivityCard
                data={data}
                isLoading={nextOffset === 'firstPage'}
              />
            </AppTouchable>
          ))
        ) : newsData.length > 0 && !isTabLeft ? (
          newsData.map((data, index) => (
            <AppTouchable
              key={index}
              onPress={() =>
                RootNavigation.navigate('ProfileNoticeDetailScreen', {
                  noticeId: data?.noticeId,
                })
              }
            >
              <NewsCard
                key={index}
                data={data}
                isLoading={nextOffset === 'firstPage'}
              />
            </AppTouchable>
          ))
        ) : isDataLoading ? (
          [1, 1, 1, 1, 1, 1, 1].map((_, index) => (
            <ActivityCard data={''} isLoading={true} key={index} />
          ))
        ) : (
          <View style={styles.alarm_none}>
            {Svg('alarm_none')}
            <AppText
              size={14}
              color={colors.Color6B6A6A}
              style={styles.alarm_none_text}
            >
              새로운 알림이 없어요.
            </AppText>
          </View>
        )}
      </ScrollView>
    </Screen>
  );
};

export default AlarmMainScreen;

export const styles = StyleSheet.create({
  headerStyle: {
    fontWeight: 'bold',
  },
  tabView: {
    height: toSize(48),
    width: '100%',
    // borderBottomWidth: toSize(1),
    flexDirection: 'row',
  },
  tab: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    backgroundColor: 'white',
    paddingTop: toSize(12),
    width: '100%',
    height: '100%',
  },
  alarm_none: {
    width: '100%',
    height: WINDOW_HEIGHT - toSize(240),
    justifyContent: 'center',
    alignItems: 'center',
  },
  alarm_none_text: {
    marginTop: toSize(22),
  },
  grayline: {
    position: 'relative',
    width: '100%',
    height: toSize(2),
    borderBottomColor: colors.ColorEEEEEE,
    borderBottomWidth: toSize(1),
  },
  blackline: {
    position: 'absolute',
    height: toSize(2),
    width: '40%',
    backgroundColor: colors.Color2D2F30,
    borderRadius: 9999,
  },
  left: {
    left: '5%',
  },
  right: {
    right: '5%',
  },
});
