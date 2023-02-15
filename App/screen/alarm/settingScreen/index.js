import React, { useEffect, useState } from 'react';
import Screen from '../../Screen';
import AppHeader from '../../../component/common/appHeader';
import Svg from '../../../asset/svg';
import { StyleSheet } from 'react-native';
import { colors } from '../../../config/globalStyle';
import RootNavigation from '../../../RootNavigation';
import AlarmScrollView from '../../../component/alarm/alarmScrollView';
import AlarmContentTitle from '../../../component/alarm/alarmContentTitle';
import AlarmContent from '../../../component/alarm/alarmContent';
import { nowDate } from '../../../function/nowdate';
import {
  getMembersAlarms,
  patchMembersAlarms,
  patchMembersTerms,
} from '../../../api/user';
import { callApi } from '../../../function/auth';
import requestUserPermission from '../../../function/fcm';

const AlarmSettingScreen = () => {
  const [toastText, setToastText] = useState();
  const [togglesData, setTogglesData] = useState({
    allSetting: false,
    newMember: false,
    newReview: false,
    newDaily: false,
    comment: false,
    keep: false,
    joinOut: false,
    follow: false,
    marketing: false,
  });
  const nowdate = () => nowDate('.');
  useEffect(() => {
    const getData = async () => {
      const { data } = await getMembersAlarms();
      console.log('dataaa', data);
      if (data.apiStatus.apiCode === 200) {
        setTogglesData(data.data);
      }
    };
    getData();
  }, []);
  const togglePress = async (toggle) => {
    if (toggle === 'allSetting' || togglesData.allSetting) {
      setTogglesData({ ...togglesData, [toggle]: !togglesData[toggle] });
      await patchMembersAlarms({
        ...togglesData,
        [toggle]: !togglesData[toggle],
      });
      await requestUserPermission();
    }
  };

  return (
    <Screen
      toastText={toastText}
      topSafeAreaColor={'white'}
      bottomSafeAreaColor={colors.ColorF5F5F5}
    >
      <AppHeader
        title="알림설정"
        style={styles.headerStyle}
        leftIcon={Svg('back_thin')}
        leftIconPress={() => RootNavigation.goBack()}
      />
      <AlarmScrollView>
        <AlarmContentTitle text="알림" />
        <AlarmContent
          mainText="알림 허용"
          toggleState={togglesData.allSetting}
          onTogglePress={() => {
            togglePress('allSetting');
          }}
        />
        <AlarmContentTitle text="그룹 활동 알림" />
        <AlarmContent
          mainText="새 멤버 참여 알림"
          toggleState={togglesData.newMember}
          onTogglePress={() => {
            togglePress('newMember');
          }}
          isBlocked={!togglesData.allSetting}
        />
        <AlarmContent
          mainText="새 리뷰 글 알림"
          isBlocked={!togglesData.allSetting}
          arrow
          arrowPress={() =>
            RootNavigation.navigate('AlarmNewPostScreen', { type: 'review' })
          }
        />
        <AlarmContent
          mainText="새 일상 글 알림"
          isBlocked={!togglesData.allSetting}
          arrow
          arrowPress={() =>
            RootNavigation.navigate('AlarmNewPostScreen', { type: 'daily' })
          }
        />
        <AlarmContent
          mainText="댓글 알림"
          subText="내 글의 댓글, 답댓글"
          toggleState={togglesData.comment}
          onTogglePress={() => {
            togglePress('comment');
          }}
          isBlocked={!togglesData.allSetting}
        />
        <AlarmContent
          mainText="내 글이 킵됐을 때 알림"
          toggleState={togglesData.keep}
          onTogglePress={() => {
            togglePress('keep');
          }}
          isBlocked={!togglesData.allSetting}
        />
        <AlarmContent
          mainText="탈퇴, 초대 알림"
          toggleState={togglesData.joinOut}
          onTogglePress={() => {
            togglePress('joinOut');
          }}
          isBlocked={!togglesData.allSetting}
        />
        <AlarmContentTitle text="팔로잉 알림" />
        <AlarmContent
          mainText="팔로우 되었을 때 알림"
          toggleState={togglesData.follow}
          onTogglePress={() => {
            togglePress('follow');
          }}
          isBlocked={!togglesData.allSetting}
        />
        <AlarmContent
          mainText="팔로잉 멤버 새 글 알림"
          arrow
          arrowPress={() =>
            RootNavigation.navigate('AlarmFollowingMemberScreen')
          }
          isBlocked={!togglesData.allSetting}
        />
        <AlarmContentTitle text="기타 알림" />
        <AlarmContent
          mainText="이벤트 및 서비스 알림"
          subText="이벤트, 서비스 등 유용한 정보 알림"
          toggleState={togglesData.marketing}
          onTogglePress={() => {
            if (!togglesData.allSetting) {
              return;
            }
            setToastText(
              `킵잇에서 보내는 광고성 정보 받기를\n수신 ${
                togglesData.marketing ? '거부' : '동의'
              }했어요 ${nowdate()}`,
            );
            togglePress('marketing');
            callApi(
              patchMembersTerms,
              { marketing: !togglesData.marketing },
              () => {},
            );
          }}
          isBlocked={!togglesData.allSetting}
        />
      </AlarmScrollView>
    </Screen>
  );
};

export default AlarmSettingScreen;

export const styles = StyleSheet.create({
  headerStyle: {
    fontWeight: 'bold',
  },
});
