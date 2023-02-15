import React, { useEffect, useState } from 'react';
import Screen from '../../Screen';
import AppHeader from '../../../component/common/appHeader';
import Svg from '../../../asset/svg';
import { StyleSheet } from 'react-native';
import RootNavigation from '../../../RootNavigation';
import AlarmMargin from '../../../component/alarm/alarmMargin';
import AlarmContent from '../../../component/alarm/alarmContent';
import AlarmScrollView from '../../../component/alarm/alarmScrollView';
import AlarmContentTitle from '../../../component/alarm/alarmContentTitle';
import { getMembersAlarms, patchMembersAlarms } from '../../../api/user';
import { getGroupsAlarmList, patchGroupsAlarmList } from '../../../api/group';

const AlarmNewPostScreen = ({ route }) => {
  const [groupListData, setGroupListData] = useState([]);
  const [togglesData, setTogglesData] = useState({
    allSetting: false,
    newMember: false,
    newReview: false,
    newDaily: false,
    comment: false,
    keep: false,
    joinOut: false,
    follow: false,
  });
  console.log('groupListData:: ', groupListData);
  const permission =
    route.params.type === 'review'
      ? togglesData.newReview
      : togglesData.newDaily;
  const alarmType = route.params.type === 'review' ? 'REVIEW' : 'DAILY';
  console.log('permission:: ', permission);

  useEffect(() => {
    const getData = async () => {
      const [{ data: permissionData }, { data: toggleListData }] =
        await Promise.all([getMembersAlarms(), getGroupsAlarmList(alarmType)]);
      if (permissionData.apiStatus.apiCode === 200) {
        setTogglesData(permissionData.data);
      }
      if (toggleListData.apiStatus.apiCode === 200) {
        setGroupListData(toggleListData.data);
      }
    };
    getData();
  }, [alarmType]);
  const togglePress = (toggle) => {
    if (toggle === 'allSetting' || togglesData.allSetting) {
      setTogglesData({ ...togglesData, [toggle]: !togglesData[toggle] });
      patchMembersAlarms({
        ...togglesData,
        [toggle]: !togglesData[toggle],
      });
    }
  };
  return (
    <Screen topSafeAreaColor={'white'}>
      <AppHeader
        title={`새 ${route.params.type === 'review' ? '리뷰' : '일상'} 글 알림`}
        style={styles.headerStyle}
        leftIcon={Svg('back_thin')}
        leftIconPress={() => RootNavigation.goBack()}
      />
      <AlarmScrollView>
        <AlarmMargin />
        <AlarmContent
          mainText="알림 허용"
          toggleState={permission}
          onTogglePress={() => {
            togglePress(
              route.params.type === 'review' ? 'newReview' : 'newDaily',
            );
          }}
        />
        <AlarmContentTitle text="그룹 설정" />
        {groupListData.map((groupData, index) => {
          return (
            <AlarmContent
              toggleState={groupData.alarmYn}
              mainText={groupData.groupName}
              key={groupData.groupId}
              onTogglePress={() => {
                if (!permission) {
                  return;
                }
                setGroupListData((data) => [
                  ...data.slice(0, index),
                  { ...data[index], alarmYn: !data[index].alarmYn },
                  ...data.slice(index + 1),
                ]);
                patchGroupsAlarmList({
                  groupId: groupData.groupId,
                  alarmType,
                });
              }}
              isBlocked={!permission}
            />
          );
        })}
      </AlarmScrollView>
    </Screen>
  );
};

export default AlarmNewPostScreen;

export const styles = StyleSheet.create({
  headerStyle: {
    fontWeight: 'bold',
  },
});
