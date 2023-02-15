import React, { useEffect, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';
import AppHeader from '../../../component/common/appHeader';
import { colors, fonts, toSize } from '../../../config/globalStyle';
import RootNavigation from '../../../RootNavigation';
import Screen from '../../Screen';
import Svg from '../../../asset/svg';
import { getNotice, getNoticeDetail } from '../../../api/myPage';
import { callApi } from '../../../function/auth';
import AppTouchable from '../../../component/common/appTouchable';
import AppText from '../../../component/common/appText';
import Markdown from 'react-native-markdown-package';

const ProfileNoticeDetailScreen = ({ route: { params } }) => {
  const [data, setData] = useState();

  useEffect(() => {
    callApi(getNoticeDetail, { noticeId: params.noticeId }, handleNotice);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNotice = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      setData(res.data.data);
    }
  };

  return (
    <Screen>
      <AppHeader
        title={'공지사항'}
        leftIcon={Svg('ic_backBtn')}
        leftIconPress={() => RootNavigation.goBack()}
      />
      <ScrollView>
        <View style={styles.notice}>
          <AppText weight={'medium'} size={16} numberOfLines={2}>
            {data?.title}
          </AppText>
          <AppText color={colors.Color6B6A6A} style={{ marginTop: toSize(4) }}>
            {data?.createDt?.substring(0, 10).replaceAll('-', '.')}
          </AppText>
        </View>

        <View style={styles.content}>
          <Markdown styles={styles.markdownStyle}>{data?.content}</Markdown>
        </View>
      </ScrollView>
    </Screen>
  );
};

export default ProfileNoticeDetailScreen;

const styles = StyleSheet.create({
  notice: {
    marginHorizontal: toSize(13),
    paddingVertical: toSize(8),
    borderBottomWidth: 1,
    borderColor: colors.ColorF4F4F4,
  },

  content: {
    marginHorizontal: toSize(13),
    marginTop: toSize(16),
  },
  markdownStyle: {
    text: {
      // fontFamily: fonts.SpoqaHanSansNeo_Regular,
    },
  },
});
