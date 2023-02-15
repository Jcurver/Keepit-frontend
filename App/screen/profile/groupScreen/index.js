import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Keyboard,
  StyleSheet,
  View,
} from 'react-native';
import { colors, images, toSize } from '../../../config/globalStyle';
import MyIcon from '../../../config/icon-font';
import RootNavigation from '../../../RootNavigation';
import AppTouchable from '../../../component/common/appTouchable';
import AppText from '../../../component/common/appText';
import Screen from '../../Screen';
import Svg from '../../../asset/svg';
import AppHeader from 'component/common/appHeader';
import { callApi } from '../../../function/auth';
import ProfileGroupCard from '../../../component/profile/groupCard';
import {
  deleteMypageGroupsWritings,
  getMypageGroupsManagement,
} from '../../../api/myPage';
import AppModal from '../../../component/common/appModal';
import { deleteGroups, deleteGroupsLeave } from '../../../api/group';
import AppLoading from '../../../component/common/appLoading';
import { isEmpty } from 'lodash';
import updateSameText from '../../../function/updateSameText';

const ProfileGroupScreen = () => {
  const [type, setType] = useState('참여그룹');
  const [choosenGroupId, setChoosenGroupId] = useState(null);
  const [data, setData] = useState();
  const [groupCount, setGroupCount] = useState(0);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [quitVisible, setQuitVisible] = useState(false);
  const [writingVisible, setWritingVisible] = useState(false);
  const [groupDeleteVisible, setGroupDeleteVisible] = useState(false);
  const [deleteDt, setDeleteDt] = useState();
  const [toastText, setToastText] = useState();

  const changeType = (t) => {
    if (t === '참여그룹') {
      return 'ALL';
    } else if (t === '내 그룹') {
      return 'MY';
    } else if (t === '탈퇴그룹') {
      return 'WITHDRAWAL';
    }
  };

  useEffect(() => {
    setData(null);
    callApi(
      getMypageGroupsManagement,
      { type: changeType(type) },
      handleGroupRefresh,
    );
  }, [type]);

  const handleGroupRefresh = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      setData(res.data.data.groups);
      setGroupCount(res.data.data.groupCount);
    }
  };

  const handleGroup = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      const temp = [...data, ...res.data.data.groups];
      setData(temp);
      setGroupCount(res.data.data.groupCount);
    }
  };

  const handleLeave = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      setToastText((text) => updateSameText('그룹이 삭제되었어요.', text));
      callApi(
        getMypageGroupsManagement,
        { type: changeType(type) },
        handleGroupRefresh,
      );
    }
  };

  const handleWriting = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      setToastText((text) => updateSameText('작성글이 삭제됐어요.', text));
      setData(null);
      callApi(
        getMypageGroupsManagement,
        { type: changeType(type) },
        handleGroupRefresh,
      );
    } else if (res.data.apiStatus.apiCode === 800) {
      Alert.alert('없는 그룹입니다.');
    }
  };

  const tabData = [
    {
      title: '참여그룹',
      onPress: () => setType('참여그룹'),
      active: type === '참여그룹',
    },
    {
      title: '내 그룹',
      onPress: () => setType('내 그룹'),
      active: type === '내 그룹',
    },
    {
      title: '탈퇴그룹',
      onPress: () => setType('탈퇴그룹'),
      active: type === '탈퇴그룹',
    },
  ];

  return (
    <Screen type="view" toastText={toastText}>
      <AppHeader
        title={'그룹관리'}
        leftIcon={Svg('ic_backBtn')}
        leftIconPress={() => RootNavigation.goBack()}
      />

      <View style={styles.tabSection}>
        {tabData.map((item, index) => {
          return (
            <View key={`tabinvite_${index}`}>
              <AppTouchable
                key={`tabinvite_${index}`}
                opacity={1}
                disabled={item.active}
                onPress={item.onPress}
                style={[styles.tabButton, item.active && styles.tabIndicator]}
              >
                <AppText
                  size={16}
                  weight={'bold'}
                  color={!item.active ? colors.ColorA7A7A7 : colors.Color2D2F30}
                >
                  {item.title}
                </AppText>
              </AppTouchable>
            </View>
          );
        })}
      </View>
      {isEmpty(data) && data?.length !== 0 ? (
        <AppLoading
          overlay={false}
          transparent={true}
          indicatorColor={colors.black}
        />
      ) : (
        <FlatList
          contentContainerStyle={styles.keepContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={'handled'}
          data={data}
          ListHeaderComponent={
            <AppTouchable style={styles.modify}>
              <AppText size={16}>{'그룹 ' + groupCount}</AppText>
            </AppTouchable>
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <AppText
                size={16}
                color={colors.Color6B6A6A}
                style={styles.emptyText}
              >
                {type === '참여그룹'
                  ? '참여한 그룹이 없어요.'
                  : type === '내 그룹'
                  ? '내가 만든 그룹이 없어요.'
                  : '탈퇴한 그룹중\n게시글이 남아있는 그룹이 없어요.'}
              </AppText>
            </View>
          }
          // keyExtractor={(item, index) => `keep${index}`}
          renderItem={({ item }) => {
            return (
              <ProfileGroupCard
                data={item}
                type={type}
                onPress={() => {
                  setChoosenGroupId(item.groupId);
                  if (type === '참여그룹') {
                    setQuitVisible(true);
                  } else if (type === '내 그룹') {
                    if (item.deleteDt) {
                      setDeleteDt(item.deleteDt);
                      setGroupDeleteVisible(true);
                    } else {
                      setDeleteVisible(true);
                    }
                  } else if (type === '탈퇴그룹') {
                    setWritingVisible(true);
                  }
                }}
              />
            );
          }}
          onScrollBeginDrag={() => Keyboard.dismiss()}
          scrollEventThrottle={4}
          onEndReachedThreshold={0}
          onEndReached={({ distanceFromEnd }) => {
            if (distanceFromEnd && data.length < groupCount) {
              callApi(
                getMypageGroupsManagement,
                { type: changeType(type) },
                handleGroup,
              );
            }
          }}
        />
      )}

      <AppModal
        visible={deleteVisible}
        title={'정말 그룹을 삭제하시겠어요?'}
        content={
          '그룹을 삭제하고 한 달이 지나면\n모든 정보가 영구 삭제돼요\n신중하게 결정해 주세요.'
        }
        leftButtonText={'취소'}
        onPressLeft={() => {
          setDeleteVisible(false);
          setChoosenGroupId(null);
        }}
        rightButtonText={'삭제하기'}
        onPressRight={() => {
          setDeleteVisible(false);
          callApi(deleteGroups, choosenGroupId, handleLeave);
          setChoosenGroupId(null);
        }}
      />

      <AppModal
        visible={quitVisible}
        title={'정말 그룹을 나가시겠어요?'}
        content={'탈퇴 그룹에 작성된 글은\nmy > 그룹관리에서 삭제할 수 있어요'}
        leftButtonText={'취소'}
        onPressLeft={() => {
          setQuitVisible(false);
          setChoosenGroupId(null);
        }}
        rightButtonText={'나가기'}
        onPressRight={() => {
          setQuitVisible(false);
          callApi(deleteGroupsLeave, choosenGroupId, handleLeave);
          setChoosenGroupId(null);
        }}
      />

      <AppModal
        visible={writingVisible}
        title={'작성 글을 삭제하시겠어요?'}
        content={'해당 그룹에 작성한 모든 글이 삭제돼요.'}
        leftButtonText={'취소'}
        onPressLeft={() => {
          setWritingVisible(false);
          setChoosenGroupId(null);
        }}
        rightButtonText={'삭제하기'}
        onPressRight={() => {
          setWritingVisible(false);
          callApi(
            deleteMypageGroupsWritings,
            { groupId: choosenGroupId },
            handleWriting,
          );
          setChoosenGroupId(null);
        }}
      />

      <AppModal
        visible={groupDeleteVisible}
        title={'그룹 삭제 안내'}
        content={`이 그룹은 ${deleteDt}에 영구 삭제돼요.\n유지기간 동안은 작성글과 지도를 보는\n활동만 할 수 있어요.`}
        rightButtonText={'확인'}
        onPressRight={() => {
          setDeleteDt(null);
          setGroupDeleteVisible(false);
        }}
      />

      {/* {loading && <AppLoading />} */}
    </Screen>
  );
};

export default ProfileGroupScreen;

const styles = StyleSheet.create({
  choice: {
    flexDirection: 'row',
    marginTop: toSize(16),
    marginLeft: toSize(16),
    marginBottom: toSize(8),
    alignItems: 'center',
  },
  tabSection: {
    marginTop: toSize(8),
    backgroundColor: colors.white,
    height: toSize(48),
    paddingHorizontal: toSize(16),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: colors.ColorE5E5E5,
  },
  tabButton: {
    width: toSize(109),
    alignItems: 'center',
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
    marginBottom: toSize(8),
  },
  empty: {
    marginTop: toSize(252),
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
  },
});
