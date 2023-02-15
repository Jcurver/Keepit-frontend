import React, { useEffect, useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, View } from 'react-native';
import AppHeader from '../../../component/common/appHeader';
import AppText from '../../../component/common/appText';
import AppTouchable from '../../../component/common/appTouchable';
import { colors, images, toSize } from '../../../config/globalStyle';
import { styles } from './styles';
import { callApi } from '../../../function/auth';
import RootNavigation from '../../../RootNavigation';
import Screen from '../../Screen';
import GroupListboxWithStar from '../../../component/group/groupListboxWithStar';
import { useFocusEffect } from '@react-navigation/native';
import { getMyGroups } from '../../../api/group';
import { useCallback } from 'react';
import { get, isEmpty } from 'lodash';
import { postGroupsFavorite } from '../../../api/group';
import MyIcon from '../../../config/icon-font';
import updateSameText from '../../../function/updateSameText';
import Svg from '../../../asset/svg';
import messaging from '@react-native-firebase/messaging';
import { useDispatch, useSelector } from 'react-redux';
import { setFcmMessage } from '../../../store/feature/deviceSlice';
import { navToScreenFromAlarm } from '../../alarm/mainScreen';
import {
  setGroupNavigate,
  setGroupToast,
} from '../../../store/feature/groupSlice';
import store from '../../../store';
import AppModal from '../../../component/common/appModal';

const GroupMainScreen = () => {
  // const triggerBackgroundMessage = () => {
  //   messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  //     console.log('Message handled in the background!', remoteMessage);
  //     setBackgroundFcm(JSON.stringify(remoteMessage));
  //     // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
  //     // RootNavigation.navigate('ProfileMainScreen');
  //   });
  // };
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [groupData, setGroupData] = useState(null);
  const [favoriteGroupData, setFavoriteGroupData] = useState(null);
  const [toastText, setToastText] = useState();
  const [isApiLoading, setIsApiLoading] = useState(false);
  const backgroundFcm = useSelector((state) => state.device.fcmMessage);

  // useEffect(() => {
  //   if (backgroundFcm) {
  //     navToScreenFromAlarm(backgroundFcm?.data);
  //     dispatch(setFcmMessage(undefined));
  //   }
  // }, [dispatch, backgroundFcm]);

  useFocusEffect(
    useCallback(() => {
      const param = { type: 'ALL' };
      callApi(getMyGroups, param, handleGroupList);
      if (store.getState().group.groupToast) {
        setToastText((toast) => updateSameText('그룹이 삭제되었어요.', toast));
        dispatch(setGroupToast(false));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );
  // useEffect(() => {
  //   // triggerBackgroundMessage();
  //   const listenBackgroundFcm = messaging().setBackgroundMessageHandler(
  //     async (remoteMessage) => {
  //       console.log('Message handled in the background!', remoteMessage);
  //       // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
  //       // RootNavigation.navigate('ProfileMainScreen');
  //     },
  //   );
  //   return listenBackgroundFcm;
  // }, []);

  const handleGroupList = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      setGroupData(res.data.data.groupList);
      setFavoriteGroupData(res.data.data.favoriteGroupList);
      if (store.getState().group.groupNavigate) {
        dispatch(setGroupNavigate(false));
        RootNavigation.navigate('SearchMainScreen', {
          groupData: res.data.data.groupList,
          favoriteGroupData: res.data.data.favoriteGroupList,
        });
      }
    }
  };

  const handleFavorite = (res) => {
    setIsApiLoading(false);
    if (res.data.apiStatus.apiCode === 200) {
      setToastText((text) =>
        updateSameText('자주찾는 그룹에 추가되었어요.', text),
      );
      const params = { type: 'ALL' };
      callApi(getMyGroups, params, handleGroupList);
    }
  };

  const handleFavoriteUnlike = (res) => {
    setIsApiLoading(false);
    if (res.data.apiStatus.apiCode === 200) {
      setToastText((text) =>
        updateSameText('자주찾는 그룹에서 삭제되었어요.', text),
      );
      const params = { type: 'ALL' };
      callApi(getMyGroups, params, handleGroupList);
    }
  };

  const handleCreate = () => {
    let count = 0;
    groupData.forEach((element) => {
      if (element.isMaster === true) {
        count++;
      }
    });
    favoriteGroupData.forEach((element) => {
      if (element.isMaster === true) {
        count++;
      }
    });
    console.log(count);
    if (count > 9) {
      setVisible(true);
    } else {
      RootNavigation.navigate('GroupCreateScreen');
    }
  };

  return (
    <Screen topSafeAreaColor={'white'} toastText={toastText}>
      <AppHeader
        leftIcon={
          <View style={styles.createBox}>
            {Svg('ic_plus')}
            <AppText style={styles.plus} color={colors.primary}>
              그룹 만들기
            </AppText>
          </View>
        }
        leftIconPress={() => {
          handleCreate();
          // setVisible(true);
          // RootNavigation.navigate('GroupCreateScreen');
        }}
        rightIcon={<MyIcon name={'ic_search'} size={toSize(20)} />}
        rightIconPress={() =>
          RootNavigation.navigate('SearchMainScreen', {
            groupData,
            favoriteGroupData,
          })
        }
        title={'그룹'}
        iconStyle={styles.iconStyle}
      />
      {backgroundFcm ? <AppText>{backgroundFcm}</AppText> : <></>}

      {groupData && favoriteGroupData ? (
        isEmpty(groupData) && isEmpty(favoriteGroupData) ? (
          <View style={styles.startContainer}>
            <AppTouchable
              style={styles.search}
              onPress={() =>
                RootNavigation.navigate('SearchMainScreen', {
                  groupData,
                  favoriteGroupData,
                })
              }
            >
              <View style={styles.searchBox}>
                <MyIcon
                  name={'ic_search'}
                  size={toSize(20)}
                  color={colors.white}
                  style={{ marginRight: toSize(10) }}
                />
                <AppText size={16} weight={'bold'} color={colors.white}>
                  그룹 탐험하기
                </AppText>
              </View>
            </AppTouchable>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.menu}>
              <AppText size={16}>자주 찾는 그룹</AppText>
              {!isEmpty(favoriteGroupData) && (
                <AppTouchable
                  onPress={() => {
                    if (!isEmpty(favoriteGroupData)) {
                      RootNavigation.navigate('GroupModifyScreen', {
                        data: favoriteGroupData,
                      });
                    }
                  }}
                >
                  <AppText size={12}>편집</AppText>
                </AppTouchable>
              )}
            </View>
            {!isEmpty(favoriteGroupData) ? (
              favoriteGroupData.map((item, index) => {
                return (
                  <GroupListboxWithStar
                    key={`groupStar${index}`}
                    data={item}
                    onPress={() =>
                      RootNavigation.navigate('GroupHomeScreen', {
                        groupId: item.groupId,
                      })
                    }
                    onStarPress={() => {
                      if (!isApiLoading) {
                        setIsApiLoading(true);
                        callApi(
                          postGroupsFavorite,
                          item.groupId,
                          item.favorite ? handleFavoriteUnlike : handleFavorite,
                        );
                      }
                    }}
                  />
                );
              })
            ) : (
              <AppText
                size={13}
                color={colors.Color6B6A6A}
                style={styles.empty}
              >
                {
                  ' 자주 찾는 그룹이 없어요.\n 아래 그룹 리스트에 별 아이콘을 눌러 자주 찾는 그룹 리스트에\n 추가해주세요.'
                }
              </AppText>
            )}
            <View style={styles.menu}>
              <AppText size={16}>그룹</AppText>
            </View>
            {!isEmpty(groupData) &&
              groupData.map((item, index) => {
                return (
                  <GroupListboxWithStar
                    key={`groupStar${index}`}
                    data={item}
                    onPress={() =>
                      RootNavigation.navigate('GroupHomeScreen', {
                        groupId: item.groupId,
                      })
                    }
                    onStarPress={() => {
                      if (!isApiLoading) {
                        setIsApiLoading(true);
                        callApi(
                          postGroupsFavorite,
                          item.groupId,
                          item.favorite ? handleFavoriteUnlike : handleFavorite,
                        );
                      }
                    }}
                  />
                );
              })}
          </ScrollView>
        )
      ) : (
        <></>
      )}

      <AppModal
        visible={visible}
        icon={
          <MyIcon
            name={'ic_warn'}
            size={toSize(42)}
            style={{ marginBottom: toSize(16) }}
          />
        }
        title={'더 이상 그룹을 생성 할 수 없습니다.'}
        content={'그룹 생성 최대 10개 제한'}
        rightButtonText={'확인'}
        onPressRight={() => setVisible(false)}
      />
    </Screen>
  );
};

export default GroupMainScreen;
