import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import AppHeader from '../../../component/common/appHeader';
import { colors, toSize } from '../../../config/globalStyle';
import RootNavigation from '../../../RootNavigation';
import Screen from '../../Screen';
import Svg from '../../../asset/svg';
import { getNotice } from '../../../api/myPage';
import { callApi } from '../../../function/auth';
import AppTouchable from '../../../component/common/appTouchable';
import AppText from '../../../component/common/appText';

const ProfileNoticeScreen = () => {
  const [data, setData] = useState();
  const [lastNoticeId, setLastNoticeId] = useState();

  useEffect(() => {
    callApi(getNotice, { pageSize: 10 }, handleNoticeRefresh);
  }, []);

  const handleNoticeRefresh = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      setData(res.data.data.notices);
      setLastNoticeId(res.data.data.lastNoticeId);
    }
  };

  const handleNotice = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      const temp = [...data, ...res.data.data.notices];
      setData(temp);
      setLastNoticeId(res.data.data.lastNoticeId);
    }
  };

  return (
    <Screen>
      <AppHeader
        title={'공지사항'}
        leftIcon={Svg('ic_backBtn')}
        leftIconPress={() => RootNavigation.goBack()}
      />

      <FlatList
        contentContainerStyle={{
          marginTop: toSize(10),
        }}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        // ListEmptyComponent={
        //   <View style={styles.empty}>
        //     <AppText
        //       size={16}
        //       color={colors.Color6B6A6A}
        //       style={styles.emptyText}
        //     >
        //       {fromHome
        //         ? type === '리뷰'
        //           ? '아직 작성된 리뷰가 없어요\n 아래 아이콘을 눌러 첫 리뷰를 작성해보세요.'
        //           : '아직 작성된 일상글이 없어요\n 아래 아이콘을 눌러 첫 일상글을 작성해보세요.'
        //         : type === '리뷰'
        //         ? '아직 작성된 리뷰가 없어요\n 첫 리뷰를 작성해보세요!'
        //         : '아직 작성된 일상글이 없어요\n 첫 일상글을 작성해보세요!'}
        //     </AppText>
        //   </View>
        // }
        data={data}
        keyExtractor={(item, index) => `Notice_${index}`}
        renderItem={({ item, index }) => (
          <AppTouchable
            style={styles.noticeCard}
            onPress={() =>
              RootNavigation.navigate('ProfileNoticeDetailScreen', {
                noticeId: item.noticeId,
              })
            }
          >
            <AppText weight={'medium'} size={16} numberOfLines={2}>
              {item.title}
            </AppText>
            <AppText
              color={colors.Color6B6A6A}
              style={{ marginTop: toSize(4) }}
            >
              {item.createDt?.substring(0, 10).replaceAll('-', '.')}
            </AppText>
          </AppTouchable>
        )}
        scrollEventThrottle={4}
        onEndReachedThreshold={0}
        onEndReached={({ distanceFromEnd }) => {
          if (distanceFromEnd && lastNoticeId) {
            callApi(getNotice, { pageSize: 10, lastNoticeId }, handleNotice);
          }
        }}
      />
    </Screen>
  );
};

export default ProfileNoticeScreen;

const styles = StyleSheet.create({
  noticeCard: {
    marginHorizontal: toSize(16),
    paddingVertical: toSize(8),
    borderBottomWidth: 1,
    borderColor: colors.ColorF4F4F4,
  },
});
