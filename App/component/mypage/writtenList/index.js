import { isEmpty } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import AppLoading from '../../common/appLoading';
import { colors, toSize } from '../../../config/globalStyle';
import jwt_decode from 'jwt-decode';
import { callApi } from '../../../function/auth';
import AppText from '../../common/appText';
import ProfileWrittenCard from '../../profile/writtenCard';

const MypageWrittenList = ({
  visible,
  data,
  type,
  handleGetData,
  reviewSeq,
  dailySeq,
  offset,
}) => {
  const [refresh, setRefresh] = useState(false);

  const onRefresh = () => {
    handleGetData(type, true);
  };

  return visible ? (
    <>
      {isEmpty(data) && data?.length !== 0 ? (
        <AppLoading
          overlay={false}
          transparent={true}
          indicatorColor={colors.black}
        />
      ) : (
        <FlatList
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: toSize(18),
            paddingBottom: toSize(50),
          }}
          refreshing={refresh}
          onRefresh={onRefresh}
          ListEmptyComponent={
            <View style={styles.empty}>
              <AppText
                size={16}
                color={colors.Color6B6A6A}
                style={styles.emptyText}
              >
                {`아직 작성한 ${
                  type === '리뷰'
                    ? '리뷰가'
                    : type === '일상'
                    ? '일상글이'
                    : '작성댓글이'
                } 없어요`}
              </AppText>
            </View>
          }
          showsVerticalScrollIndicator={false}
          data={data}
          keyExtractor={(item, index) => `MypageWrittenList_${index}`}
          renderItem={({ item, index }) => (
            <ProfileWrittenCard
              data={item}
              daily={type === '일상'}
              comment={type === '작성댓글'}
            />
          )}
          // scrollEventThrottle={4}
          // onEndReachedThreshold={0}
          onEndReached={({ distanceFromEnd }) => {
            if (distanceFromEnd) {
              // 데이터 받아오기
              if (
                (type === '리뷰' && reviewSeq) ||
                (type === '일상' && dailySeq) ||
                (type === '작성댓글' && offset)
              ) {
                handleGetData(type, false);
              }
            }
          }}
        />
      )}
    </>
  ) : (
    <></>
  );
};

export const styles = StyleSheet.create({
  empty: {
    marginTop: toSize(185),
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
  },
});

export default MypageWrittenList;
