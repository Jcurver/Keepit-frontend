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
import { hasNotch } from 'react-native-device-info';
import ProfileKeepReviewCard from '../../../component/profile/keepReviewCard';
import ProfileKeepDailyCard from '../../../component/profile/keepDailyCard';
import { callApi } from '../../../function/auth';
import {
  getMypageKeepDaily,
  getMypageKeepReviews,
  patchMypageKeep,
} from '../../../api/myPage';
import { isEmpty } from 'lodash';
import AppModal from '../../../component/common/appModal';
import updateSameText from '../../../function/updateSameText';
import { useFocusEffect } from '@react-navigation/native';

const ProfileKeepScreen = ({ route: { params } }) => {
  const [type, setType] = useState('리뷰글');
  const [choose, setChoose] = useState(false);
  const [column, setColumn] = useState(2);
  const [refresh, setRefresh] = useState(false);
  const [reviewList, setReviewList] = useState();
  const [reviewOffset, setReviewOffset] = useState();
  const [dailyList, setDailyList] = useState();
  const [chooseList, setChooseList] = useState([]);
  const [dailyOffset, setDailyOffset] = useState();
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [chooseDeleteVisible, setChooseDeleteVisible] = useState(false);
  const [allDeleteVisible, setAllDeleteVisible] = useState(false);
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [toastText, setToastText] = useState();

  const onRefresh = () => {
    if (type === '리뷰글') {
      callApi(
        getMypageKeepReviews,
        { pageSize: 10, nextOffset: 0 },
        handleReviewRefresh,
      );
    } else if (type === '일상글') {
      callApi(
        getMypageKeepDaily,
        { pageSize: 10, nextOffset: 0 },
        handleDailyRefresh,
      );
    }
  };

  const handleReviewRefresh = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      setReviewList(res.data.data.keepReviews);
      setReviewOffset(res.data.data.nextOffset);
    }
  };

  const handleReview = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      if (reviewList) {
        const data = [...reviewList, ...res.data.data.keepReviews];
        setReviewList(data);
      } else {
        setReviewList(res.data.data.keepReviews);
      }
      setReviewOffset(res.data.data.nextOffset);
    }
  };

  const handleDailyRefresh = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      setDailyList(res.data.data.keepDaily);
      setDailyOffset(res.data.data.nextOffset);
    }
  };

  const handleDaily = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      if (reviewList) {
        const data = [...dailyList, ...res.data.data.keepDaily];
        setDailyList(data);
      } else {
        setDailyList(res.data.data.keepDaily);
      }
      setDailyOffset(res.data.data.nextOffset);
    }
  };

  useEffect(() => {
    if (type === '리뷰글') {
      setColumn(2);
    } else {
      setColumn(1);
    }
    setChooseList([]);
    setChoose(false);
    onRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  useEffect(() => {
    if (!choose) {
      setChooseList([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [choose]);

  useFocusEffect(
    useCallback(() => {
      if (params?.isRefresh) {
        onRefresh();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params]),
  );

  const tabData = [
    {
      title: '리뷰글',
      onPress: () => setType('리뷰글'),
      active: type === '리뷰글',
    },
    {
      title: '일상글',
      onPress: () => setType('일상글'),
      active: type === '일상글',
    },
  ];

  const handleDelete = (all) => {
    if (all) {
      callApi(
        patchMypageKeep,
        {
          type: type === '리뷰글' ? 'REVIEW' : 'DAILY',
          isAll: true,
        },
        handleKeepDelete,
      );
    } else {
      callApi(
        patchMypageKeep,
        {
          type: type === '리뷰글' ? 'REVIEW' : 'DAILY',
          keepSeqList: chooseList,
        },
        handleKeepDelete,
      );
    }
  };

  const handleKeepDelete = (res) => {
    setIsApiLoading(false);
    if (res.data.apiStatus.apiCode === 200) {
      setToastText((toast) =>
        updateSameText('킵 목록에서 삭제 되었어요.', toast),
      );
      setChoose(false);
      onRefresh();
    }
  };

  const Card = type === '리뷰글' ? ProfileKeepReviewCard : ProfileKeepDailyCard;

  return (
    <Screen type="view" toastText={toastText}>
      <AppHeader
        title={'킵 목록'}
        leftIcon={<MyIcon name="ic_close" size={toSize(14)} />}
        leftIconPress={() => RootNavigation.goBack()}
      />

      <View style={styles.tabSection}>
        {tabData.map((item, index) => {
          return (
            <View style={styles.tabContainer} key={`tabinvite_${index}`}>
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

      <FlatList
        key={column}
        numColumns={column}
        contentContainerStyle={styles.keepContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'handled'}
        refreshing={refresh}
        onRefresh={onRefresh}
        data={type === '리뷰글' ? reviewList : dailyList}
        ListEmptyComponent={
          <View style={styles.empty}>
            <AppText
              size={16}
              color={colors.Color6B6A6A}
              style={styles.emptyText}
            >
              아직 킵한 글이 없어요.
            </AppText>
          </View>
        }
        ListHeaderComponent={
          ((type === '리뷰글' && !isEmpty(reviewList)) ||
            (type === '일상글' && !isEmpty(dailyList))) && (
            <AppTouchable
              style={styles.modify}
              onPress={() => setChoose((state) => !state)}
            >
              <AppText>{choose ? '완료' : '편집'}</AppText>
            </AppTouchable>
          )
        }
        // keyExtractor={(item, index) => `keep${index}`}
        renderItem={({ item, index }) => {
          return (
            <Card
              data={item}
              index={index}
              choose={choose}
              chooseList={chooseList}
              setChooseList={setChooseList}
              setDeleteVisible={setDeleteVisible}
            />
          );
        }}
        onScrollBeginDrag={() => Keyboard.dismiss()}
        scrollEventThrottle={4}
        onEndReachedThreshold={0}
        onEndReached={({ distanceFromEnd }) => {
          if (distanceFromEnd) {
            // 데이터 받아오기
            if (type === '리뷰글' && reviewOffset) {
              callApi(
                getMypageKeepReviews,
                { pageSize: 10, nextOffset: reviewOffset },
                handleReview,
              );
            } else if (type === '일상글' && dailyOffset) {
              callApi(
                getMypageKeepDaily,
                { pageSize: 10, nextOffset: dailyOffset },
                handleDaily,
              );
            }
          }
        }}
      />

      {choose && (
        <View
          style={[
            styles.buttonContainer,
            hasNotch() && { paddingBottom: toSize(22) },
          ]}
        >
          <AppTouchable
            style={styles.choosebtnContainer}
            onPress={() => setAllDeleteVisible(true)}
            disabled={isApiLoading}
          >
            <AppText
              style={styles.chooseBtn}
              size={16}
              weight={'bold'}
              color={colors.primary}
            >
              전체지우기
            </AppText>
          </AppTouchable>

          <AppTouchable
            style={[
              styles.choosebtnContainer,
              {
                backgroundColor: isEmpty(chooseList)
                  ? colors.ColorC4C4C4
                  : colors.primary,
              },
            ]}
            disabled={isEmpty(chooseList) || isApiLoading}
            onPress={() => setChooseDeleteVisible(true)}
          >
            <AppText
              style={[styles.chooseBtn, { marginHorizontal: toSize(58.75) }]}
              size={18}
              weight={'medium'}
              color={'white'}
            >
              지우기
            </AppText>
          </AppTouchable>
        </View>
      )}

      <AppModal
        visible={chooseDeleteVisible}
        title={'선택된 킵 글을 지우시겠어요?'}
        leftButtonText={'취소'}
        onPressLeft={() => setChooseDeleteVisible(false)}
        rightButtonText={'지우기'}
        onPressRight={() => {
          setIsApiLoading(true);
          setChooseDeleteVisible(false);
          handleDelete(false);
        }}
      />

      <AppModal
        visible={allDeleteVisible}
        title={'킵한 글이 모두 삭제됩니다\n전체 삭제하시겠어요?'}
        leftButtonText={'취소'}
        onPressLeft={() => setAllDeleteVisible(false)}
        rightButtonText={'전체삭제'}
        onPressRight={() => {
          setAllDeleteVisible(false);
          handleDelete(true);
        }}
      />

      <AppModal
        visible={deleteVisible}
        title={'삭제된 게시글이에요.'}
        rightButtonText={'확인'}
        onPressRight={() => setDeleteVisible(false)}
      />
    </Screen>
  );
};

export default ProfileKeepScreen;

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
  },
});
