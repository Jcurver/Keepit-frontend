import React, { useCallback, useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Screen from '../screen/Screen';
import GroupMainScreen from '../screen/group/mainScreen';
import ProfileMainScreen from '../screen/profile/mainScreen';
import AlarmMainScreen from '../screen/alarm/mainScreen';
import MyIcon from '../config/icon-font';
import { colors, toSize } from '../config/globalStyle';
import { hasNotch } from 'react-native-device-info';
import Svg from '../asset/svg';
import GroupMapScreen from '../screen/group/mapScreen';
import MapWebScreen from '../screen/map/webScreen';
import { getAlarmCheck } from '../api/notification';
import { useDispatch, useSelector } from 'react-redux';
import { setIsNewAlarm } from '../store/feature/alertSlice';
import { useFocusEffect } from '@react-navigation/native';
import useDebounce from '../hook/useDebounce';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = ({ navigation, route }) => {
  const isNewAlarm = useSelector((state) => state.alert.isNewAlarm);
  const dispatch = useDispatch();
  useEffect(() => {
    const alarmDotCheck = async () => {
      const res = await getAlarmCheck();
      const { act, news } = res.data.data;
      if (act || news) {
        dispatch(setIsNewAlarm(true));
      } else {
        dispatch(setIsNewAlarm(false));
      }
    };
    alarmDotCheck();
  });
  const insets = useSafeAreaInsets();
  console.log('insets.bottom:: ', insets.bottom);

  return (
    <Screen type="view" topSafeArea={false}>
      <Tab.Navigator
        initialRouteName={'GroupMainScreen'}
        detachInactiveScreens={false}
        screenOptions={{
          headerShown: false,
          tabBarStyle: [
            {
              borderTopColor: colors.ColorE5E5E5,
              // backgroundColor: colors.ColorFFBEBE,
              // shadowColor: colors.black60,
              // shadowOffset: {
              //   width: 0,
              //   height: -1,
              // },
              // shadowOpacity: 0.6,
              // shadowRadius: 2,
              alignItems: 'center',
            },
            // { height: insets.bottom + toSize(42) },
            ,
          ],
          tabBarItemStyle: {
            // paddingTop: !hasNotch() && toSize(12),
            // paddingBottom: toSize(8),
          },
          tabBarLabelStyle: {
            // fontFamily: fonts.NotoSansKR_Regular,
            fontSize: toSize(12),
            marginBottom: toSize(4),
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.ColorA7A7A7,
        }}
      >
        <Tab.Screen
          name={'GroupMainScreen'}
          component={GroupMainScreen}
          options={{
            tabBarLabel: '그룹',
            tabBarIcon: ({ color, focused }) =>
              focused ? (
                <MyIcon
                  name={'ic_home'}
                  size={toSize(20)}
                  color={colors.primary}
                />
              ) : (
                Svg('ic_home_outline')
              ),
          }}
        />

        <Tab.Screen
          name={'GroupMapScreen'}
          component={GroupMapScreen}
          options={{
            tabBarLabel: '지도',
            tabBarIcon: ({ color, focused }) =>
              focused
                ? // <MyIcon
                  //   name={'ic_map'}
                  //   size={toSize(21)}
                  //   color={colors.primary}
                  // />
                  Svg('ic_map_color')
                : Svg('ic_map_outline'),
          }}
        />

        <Tab.Screen
          name={'AlarmMainScreen'}
          component={AlarmMainScreen}
          options={{
            tabBarLabel: '알림',
            tabBarIcon: ({ color, focused }) =>
              focused ? (
                <MyIcon
                  name={'ic_alarm'}
                  size={toSize(20)}
                  color={colors.primary}
                />
              ) : !isNewAlarm && !focused ? (
                Svg('ic_alarm_outline')
              ) : isNewAlarm && !focused ? (
                Svg('alarm_dot_line')
              ) : (
                Svg('ic_alarm_outline')
              ),
          }}
        />

        <Tab.Screen
          name={'ProfileMainScreen'}
          component={ProfileMainScreen}
          options={{
            tabBarLabel: '마이',
            tabBarIcon: ({ color, focused }) =>
              focused ? (
                <MyIcon
                  name={'ic_profile'}
                  size={toSize(19)}
                  color={colors.primary}
                />
              ) : (
                Svg('ic_profile_outline')
              ),
          }}
        />
      </Tab.Navigator>
    </Screen>
  );
};

export default BottomTabNavigator;
