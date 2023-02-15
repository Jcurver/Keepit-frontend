import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, Image, Keyboard, StyleSheet, View } from 'react-native';
import { colors, images, toSize } from '../../../config/globalStyle';
import MyIcon from '../../../config/icon-font';
import RootNavigation from '../../../RootNavigation';
import AppTouchable from '../../../component/common/appTouchable';
import AppText from '../../../component/common/appText';
import Screen from '../../Screen';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import Svg from '../../../asset/svg';
import AppHeader from 'component/common/appHeader';
import { callApi } from '../../../function/auth';
import ProfileFollowCard from '../../../component/profile/followCard';
import { getMypageFollowing } from '../../../api/myPage';
import { postMembersFollow } from '../../../api/group';
import updateSameText from '../../../function/updateSameText';

const ProfileFollowScreen = () => {
  const [followList, setFollowList] = useState();
  const [nextOffset, setNextOffset] = useState();
  const [refresh, setRefresh] = useState(false);
  const [toastText, setToastText] = useState();

  useEffect(() => {
    callApi(getMypageFollowing, { pageSize: 10 }, handleFollowRefresh);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRefresh = () => {
    callApi(getMypageFollowing, { pageSize: 10 }, handleFollowRefresh);
  };

  const handleFollow = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      const data = [...followList, ...res.data.data.myFollowing];
      setFollowList(data);
      setNextOffset(res.data.data.nextOffset);
    }
  };

  const handleFollowRefresh = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      setFollowList(res.data.data.myFollowing);
      setNextOffset(res.data.data.nextOffset);
    }
  };

  const handleUnFollowRefresh = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      setToastText((text) => updateSameText('멤버가 언팔로우 되었어요', text));
      callApi(getMypageFollowing, { pageSize: 10 }, handleFollowRefresh);
    }
  };

  const handleGetData = () => {};

  return (
    <Screen type="view" toastText={toastText}>
      <AppHeader
        title={'팔로잉 멤버'}
        leftIcon={<MyIcon name="ic_close" size={toSize(14)} />}
        leftIconPress={() => RootNavigation.goBack()}
      />

      <FlatList
        contentContainerStyle={styles.keepContainer}
        showsVerticalScrollIndicator={false}
        refreshing={refresh}
        onRefresh={onRefresh}
        keyboardShouldPersistTaps={'handled'}
        data={followList}
        ListEmptyComponent={
          <View style={styles.empty}>
            <AppText
              size={16}
              color={colors.Color6B6A6A}
              style={styles.emptyText}
            >
              아직 팔로우한 멤버가 없어요.
            </AppText>
          </View>
        }
        keyExtractor={(item, index) => `following${index}`}
        renderItem={({ item }) => {
          return (
            <ProfileFollowCard
              data={item}
              onPressStar={() => {
                callApi(
                  postMembersFollow,
                  {
                    groupId: item.groupId,
                    targetMid: item.memberMid,
                  },
                  handleUnFollowRefresh,
                );
              }}
              handleGetData={handleGetData}
            />
          );
        }}
        scrollEventThrottle={4}
        onEndReachedThreshold={0}
        onEndReached={({ distanceFromEnd }) => {
          if (distanceFromEnd && nextOffset) {
            callApi(
              getMypageFollowing,
              { pageSize: 10, nextOffset },
              handleFollow,
            );
          }
        }}
      />
    </Screen>
  );
};

export default ProfileFollowScreen;

const styles = StyleSheet.create({
  choice: {
    flexDirection: 'row',
    marginTop: toSize(16),
    marginLeft: toSize(16),
    marginBottom: toSize(8),
    alignItems: 'center',
  },
  tabContainer: {
    marginRight: toSize(8),
  },
  tabSection: {
    backgroundColor: colors.white,
    height: toSize(48),
    paddingLeft: toSize(16),
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: colors.ColorE5E5E5,
  },
  tabButton: {
    paddingHorizontal: toSize(10),
    paddingVertical: toSize(12),
    borderBottomWidth: 2,
    borderColor: 'white',
  },
  tabIndicator: {
    borderColor: colors.Color191919,
  },
  keepContainer: {
    flexGrow: 1,
    paddingTop: toSize(16),
    paddingHorizontal: toSize(16),
    paddingBottom: toSize(30),
    // flexWrap: 'wrap',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: toSize(16),
    marginVertical: toSize(12),
  },
  choosebtnContainer: {
    backgroundColor: colors.ColorF0FFF9,
    borderRadius: 6,
  },
  chooseBtn: {
    marginVertical: toSize(12),
    marginHorizontal: toSize(46.75),
  },
  modify: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: toSize(8),
  },
  empty: {
    flex: 1,
    // marginTop: toSize(252),
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
  },
});
