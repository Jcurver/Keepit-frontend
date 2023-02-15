import React, { useEffect, useState } from 'react';
import Screen from '../../Screen';
import AppHeader from '../../../component/common/appHeader';
import Svg from '../../../asset/svg';
import { StyleSheet, View } from 'react-native';
import { toSize } from '../../../config/globalStyle';
import RootNavigation from '../../../RootNavigation';
import AlarmScrollView from '../../../component/alarm/alarmScrollView';
import FollowingMemberCard from '../../../component/alarm/card/followingMemberCard';
import { getGroupsFollow, patchGroupsFollow } from '../../../api/group';
import AppText from '../../../component/common/appText';
import { WINDOW_HEIGHT } from '@gorhom/bottom-sheet';

const AlarmFollowingMemberScreen = () => {
  const [followData, setFollowData] = useState([]);
  const getData = async () => {
    const { data } = await getGroupsFollow();
    if (data.apiStatus.apiCode === 200) {
      setFollowData(data.data);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  const onPress = async (groupId, mid) => {
    await patchGroupsFollow({ groupId, mid });
    getData();
  };
  return (
    <Screen topSafeAreaColor={'white'}>
      <AppHeader
        title="팔로잉 멤버"
        style={styles.headerStyle}
        leftIcon={Svg('back_thin')}
        leftIconPress={() => RootNavigation.goBack()}
      />
      <AlarmScrollView style={styles.scrollView}>
        {followData.length > 0 ? (
          followData.map((data, index) => (
            <FollowingMemberCard
              memberName={data.memberName}
              groupName={data.groupName}
              alarmYn={data.alarmYn}
              onPress={() => onPress(data.groupId, data.mid)}
              key={index}
            />
          ))
        ) : (
          <View style={styles.noFollowView}>
            <AppText size={16}>아직 팔로우한 멤버가 없어요.</AppText>
          </View>
        )}
      </AlarmScrollView>
    </Screen>
  );
};

export default AlarmFollowingMemberScreen;

export const styles = StyleSheet.create({
  headerStyle: {
    fontWeight: 'bold',
  },

  scrollView: {
    backgroundColor: 'white',
    paddingTop: toSize(12),
  },
  noFollowView: {
    backgroundColor: 'white',
    paddingTop: toSize(12),
    justifyContent: 'center',
    alignItems: 'center',
    height: WINDOW_HEIGHT - toSize(224),
  },
});
