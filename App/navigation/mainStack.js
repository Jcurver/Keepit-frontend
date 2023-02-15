import React, { useEffect, useState } from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import BottomTabNavigator from './bottomTabNavigator';
import GroupMainScreen from '../screen/group/mainScreen';
import MapWebScreen from '../screen/map/webScreen';
import ProfileMainScreen from '../screen/profile/mainScreen';
import IntroScreen from '../screen/auth/introScreen';
import RegisterScreen from '../screen/auth/registerScreen';
import ProfileScreen from '../screen/auth/profileScreen';
import authStorage from '../config/authStorage';
import LoginScreen from '../screen/auth/loginScreen';
import GroupCreateScreen from '../screen/group/createScreen';
import SearchMainScreen from '../screen/group/searchMainScreen';
import SearchScreen from '../screen/group/searchScreen';
import FunctionScreen from '../screen/auth/functionScreen';
import NumChangeScreen from '../screen/auth/numChangeScreen';
import ReceiveScreen from '../screen/auth/receiveScreen';
import JoinScreen from '../screen/group/joinScreen';
import GroupHomeScreen from '../screen/group/homeScreen';
import GroupInfoScreen from '../screen/group/infoScreen';
import { useSelector } from 'react-redux';
import RootNavigation from '../RootNavigation';
import GroupModifyScreen from '../screen/group/modifyScreen';
import ReviewPostScreen from '../screen/review/postScreen';
import ReviewTemporaryScreen from '../screen/review/temporaryScreen';
import ReviewMapSearchScreen from '../screen/review/mapSearchScreen';
import ReviewListScreen from '../screen/review/listScreen';
import DailyPostScreen from '../screen/daily/postScreen';
import DailyDetailScreen from '../screen/daily/detailScreen';
import ReviewDetailScreen from '../screen/review/detailScreen';
import GroupDetailScreen from '../screen/group/detailScreen';
import GroupUserScreen from '../screen/group/userScreen';
import ProfileTestScreen from '../screen/profile/testScreen';
import ProfileServiceScreen from '../screen/profile/serviceScreen';
import ProfileSettingScreen from '../screen/profile/settingScreen';
import ProfileAccountScreen from '../screen/profile/accountScreen';
import ProfileChangeScreen from '../screen/profile/changeScreen';
import ProfileQuitScreen from '../screen/profile/quitScreen';
import ProfileWrittenScreen from '../screen/profile/writtenScreen';
import ProfileKeepScreen from '../screen/profile/keepScreen';
import ProfileFollowScreen from '../screen/profile/followScreen';
import ProfileGroupScreen from '../screen/profile/groupScreen';
import ProfileBlockScreen from '../screen/profile/blockScreen';
import ProfileNoticeScreen from '../screen/profile/noticeScreen';
import ProfileNoticeDetailScreen from '../screen/profile/noticeDetailScreen';
import AlarmMainScreen from '../screen/alarm/mainScreen';
import AlarmSettingScreen from '../screen/alarm/settingScreen';
import AlarmNewPostScreen from '../screen/alarm/newPostScreen';
import AlarmFollowingMemberScreen from '../screen/alarm/followingMemberScreen';
import ReviewMapScreen from '../screen/review/mapScreen';
import GroupMapScreen from '../screen/group/mapScreen';

const Stack = createStackNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={'Main'}
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: 'white' },
        CardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <Stack.Screen name="Main" component={BottomTabNavigator} />
      <Stack.Screen name="MapWebScreen" component={MapWebScreen} />
      {/* <Stack.Screen name="ProfileMainScreen" component={ProfileMainScreen} />
      <Stack.Screen name="ReviewMainScreen" component={ReviewMainScreen} /> */}
      <Stack.Screen
        name="IntroScreen"
        component={IntroScreen}
        options={() => ({
          gestureEnabled: false,
        })}
      />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={() => ({
          gestureEnabled: false,
        })}
      />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="FunctionScreen" component={FunctionScreen} />
      <Stack.Screen name="NumChangeScreen" component={NumChangeScreen} />
      <Stack.Screen name="ReceiveScreen" component={ReceiveScreen} />
      <Stack.Screen name="JoinScreen" component={JoinScreen} />
      <Stack.Screen name="SearchMainScreen" component={SearchMainScreen} />
      <Stack.Screen
        name="GroupCreateScreen"
        component={GroupCreateScreen}
        options={() => ({
          gestureEnabled: false,
        })}
      />
      <Stack.Screen name="GroupModifyScreen" component={GroupModifyScreen} />
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
      <Stack.Screen
        key="GroupHomeScreen"
        navigationKey="GroupHomeScreen"
        name="GroupHomeScreen"
        component={GroupHomeScreen}
      />
      <Stack.Screen
        name="ReviewPostScreen"
        component={ReviewPostScreen}
        options={() => ({
          gestureEnabled: false,
        })}
      />
      <Stack.Screen
        name="ReviewTemporaryScreen"
        component={ReviewTemporaryScreen}
      />
      <Stack.Screen
        name="ReviewMapSearchScreen"
        component={ReviewMapSearchScreen}
      />
      <Stack.Screen name="ReviewMapScreen" component={ReviewMapScreen} />
      <Stack.Screen name="ReviewListScreen" component={ReviewListScreen} />

      <Stack.Screen
        name="DailyPostScreen"
        component={DailyPostScreen}
        options={() => ({
          gestureEnabled: false,
        })}
      />
      <Stack.Screen name="ReviewDetailScreen" component={ReviewDetailScreen} />
      <Stack.Screen name="DailyDetailScreen" component={DailyDetailScreen} />
      <Stack.Screen name="GroupInfoScreen" component={GroupInfoScreen} />
      <Stack.Screen name="GroupDetailScreen" component={GroupDetailScreen} />
      <Stack.Screen name="GroupUserScreen" component={GroupUserScreen} />
      <Stack.Screen name="GroupMapScreen" component={GroupMapScreen} />
      <Stack.Screen name="ProfileTestScreen" component={ProfileTestScreen} />
      <Stack.Screen
        name="ProfileServiceScreen"
        component={ProfileServiceScreen}
      />
      <Stack.Screen
        name="ProfileSettingScreen"
        component={ProfileSettingScreen}
      />
      <Stack.Screen
        name="ProfileAccountScreen"
        component={ProfileAccountScreen}
      />
      <Stack.Screen
        name="ProfileChangeScreen"
        component={ProfileChangeScreen}
      />
      <Stack.Screen name="ProfileQuitScreen" component={ProfileQuitScreen} />
      <Stack.Screen
        name="ProfileWrittenScreen"
        component={ProfileWrittenScreen}
      />
      <Stack.Screen
        name="ProfileFollowScreen"
        component={ProfileFollowScreen}
      />
      <Stack.Screen name="ProfileBlockScreen" component={ProfileBlockScreen} />
      <Stack.Screen name="ProfileGroupScreen" component={ProfileGroupScreen} />
      <Stack.Screen name="ProfileKeepScreen" component={ProfileKeepScreen} />
      <Stack.Screen
        name="ProfileNoticeScreen"
        component={ProfileNoticeScreen}
      />
      <Stack.Screen
        name="ProfileNoticeDetailScreen"
        component={ProfileNoticeDetailScreen}
      />
      <Stack.Screen name="AlarmMainScreen" component={AlarmMainScreen} />
      <Stack.Screen name="AlarmSettingScreen" component={AlarmSettingScreen} />
      <Stack.Screen name="AlarmNewPostScreen" component={AlarmNewPostScreen} />
      <Stack.Screen
        name="AlarmFollowingMemberScreen"
        component={AlarmFollowingMemberScreen}
      />
    </Stack.Navigator>
  );
};

export default MainStack;
