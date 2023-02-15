import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, Image, Keyboard, StyleSheet, View } from 'react-native';
import { colors, images, toSize } from '../../../config/globalStyle';
import MyIcon from '../../../config/icon-font';
import RootNavigation from '../../../RootNavigation';
import AppTouchable from '../../../component/common/appTouchable';
import AppText from '../../../component/common/appText';
import Screen from '../../Screen';
import Svg from '../../../asset/svg';
import AppHeader from 'component/common/appHeader';
import { callApi } from '../../../function/auth';
import ProfileBlockCard from '../../../component/profile/blockCard';
import { getMypageBlock } from '../../../api/myPage';

const ProfileBlockScreen = () => {
  const [data, setData] = useState();
  const [nextOffset, setNextOffset] = useState(null);
  const [toastText, setToastText] = useState(null);

  useEffect(() => {
    onRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBlock = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      const temp = [...data, ...res.data.data.blocks];
      setData(temp);
      setNextOffset(res.data.data.nextOffset);
    }
  };

  const handleBlockRefresh = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      console.log(res.data.data);
      setData(res.data.data.blocks);
      setNextOffset(res.data.data.nextOffset);
    }
  };

  const onRefresh = () => {
    callApi(getMypageBlock, { pageSize: 10 }, handleBlockRefresh);
  };

  return (
    <Screen type="view" toastText={toastText}>
      <AppHeader
        title={'차단멤버'}
        leftIcon={Svg('ic_backBtn')}
        leftIconPress={() => RootNavigation.goBack()}
      />

      <FlatList
        contentContainerStyle={styles.keepContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'handled'}
        data={data}
        ListEmptyComponent={
          <View style={styles.empty}>
            <AppText
              size={16}
              color={colors.Color6B6A6A}
              style={styles.emptyText}
            >
              아직 차단한 멤버가 없어요
            </AppText>
          </View>
        }
        // keyExtractor={(item, index) => `keep${index}`}
        renderItem={({ item }) => {
          return (
            <ProfileBlockCard
              data={item}
              setToastText={setToastText}
              onRefresh={onRefresh}
            />
          );
        }}
        scrollEventThrottle={4}
        onEndReachedThreshold={0}
        onEndReached={({ distanceFromEnd }) => {
          if (distanceFromEnd) {
            // 데이터 받아오기
            if (nextOffset) {
              callApi(
                getMypageBlock,
                { pageSize: 10, nextOffset },
                handleBlock,
              );
            }
          }
        }}
      />
    </Screen>
  );
};

export default ProfileBlockScreen;

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
    // flex: 1,
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
    justifyContent: 'flex-end',
    marginBottom: toSize(8),
  },
  empty: {
    marginTop: toSize(252),
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: toSize(58),
  },
});
