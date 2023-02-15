import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';
import {
  colors,
  screenHeight,
  screenWidth,
  toSize,
} from '../../../config/globalStyle';
import MyIcon from '../../../config/icon-font';
import RootNavigation from '../../../RootNavigation';
import AppTouchable from '../../../component/common/appTouchable';
import AppText from '../../../component/common/appText';
import Screen from '../../Screen';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import AppHeader from 'component/common/appHeader';
import BottomSheetBackdrop from '../../../component/login/customBackdrop';
import { callApi } from '../../../function/auth';
import {
  getMypageComment,
  getMypageDaily,
  getMypageGroups,
  getMypageReviews,
} from '../../../api/myPage';
import MypageWrittenList from '../../../component/mypage/writtenList';
import { useFocusEffect } from '@react-navigation/native';
import updateSameText from '../../../function/updateSameText';
import { isEmpty } from 'lodash';

const ProfileWrittenScreen = ({ route: { params } }) => {
  const [group, setGroup] = useState({ groupName: '참여그룹', groupId: null });
  const [groupList, setGroupList] = useState([]);
  const [reviewList, setReviewList] = useState();
  const [reviewSeq, setReviewSeq] = useState();
  const [dailyList, setDailyList] = useState();
  const [dailySeq, setDailySeq] = useState();
  const [commentList, setCommentList] = useState();
  const [type, setType] = useState('리뷰');
  const [toastText, setToastText] = useState();
  const [offset, setOffset] = useState(1);

  const tabData = [
    {
      title: '리뷰',
      onPress: () => setType('리뷰'),
      active: type === '리뷰',
    },
    {
      title: '일상',
      onPress: () => setType('일상'),
      active: type === '일상',
    },
    {
      title: '작성댓글',
      onPress: () => setType('작성댓글'),
      active: type === '작성댓글',
    },
  ];

  const refreshAll = () => {
    callApi(
      getMypageReviews,
      { groupId: group.groupId, pageSize: 10 },
      handleReviewRefresh,
    );
    callApi(
      getMypageDaily,
      { groupId: group.groupId, pageSize: 10 },
      handleDailyRefresh,
    );
    callApi(
      getMypageComment,
      { groupId: group.groupId, pageSize: 10, offset: 0 },
      handleCommentRefresh,
    );
  };

  // 초기화면 진입, 그룹 바뀔때 마다 데이터 전체 refresh
  useEffect(() => {
    callApi(getMypageGroups, null, handleGroup);
    refreshAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group]);

  useFocusEffect(
    useCallback(() => {
      if (params?.isRefresh) {
        refreshAll();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params]),
  );

  // 게시글 삭제시 전체 refresh
  useFocusEffect(
    useCallback(() => {
      if (params?.isRefresh) {
        refreshAll();
        setToastText((toast) => updateSameText(params?.toastText, toast));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params]),
  );

  // 탭 바뀔때 마다 해당 탭 데이터 refresh
  useEffect(() => {
    if (tabData[0].active && reviewList) {
      handleGetData('리뷰', true);
    } else if (tabData[1].active) {
      handleGetData('일상', true);
    } else if (tabData[2].active) {
      handleGetData('작성댓글', true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const handleGetData = (types, refresh) => {
    if (types === '리뷰') {
      callApi(
        getMypageReviews,
        {
          groupId: group.groupId,
          pageSize: 10,
          lastSeq: refresh ? undefined : reviewSeq,
        },
        refresh ? handleReviewRefresh : handleReview,
      );
    } else if (types === '일상') {
      callApi(
        getMypageDaily,
        {
          groupId: group.groupId,
          pageSize: 10,
          lastSeq: refresh ? undefined : dailySeq,
        },
        refresh ? handleDailyRefresh : handleDaily,
      );
    } else if (types === '작성댓글') {
      if (refresh) {
        setOffset(1);
      }
      callApi(
        getMypageComment,
        { groupId: group.groupId, pageSize: 10, offset: refresh ? 0 : offset },
        refresh ? handleCommentRefresh : handleComment,
      );
    }
  };

  const handleGroup = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      setGroupList([
        { groupName: '참여그룹', groupId: null },
        ...res.data.data,
      ]);
    }
  };

  const handleReview = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      if (reviewList) {
        const data = [...reviewList, ...res.data.data.myReviews];
        setReviewList(data);
      } else {
        setReviewList(res.data.data.myReviews);
      }
      setReviewSeq(res.data.data.lastSeq);
    }
  };

  const handleReviewRefresh = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      setReviewList(res.data.data.myReviews);
      setReviewSeq(res.data.data.lastSeq);
    }
  };

  const handleDaily = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      if (dailyList) {
        const data = [...dailyList, ...res.data.data.myDaily];
        setDailyList(data);
      } else {
        setDailyList(res.data.data.myDaily);
      }
      setDailySeq(res.data.data.lastSeq);
    }
  };

  const handleDailyRefresh = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      setDailyList(res.data.data.myDaily);
      setDailySeq(res.data.data.lastSeq);
    }
  };

  const handleComment = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      if (commentList) {
        const data = [...commentList, ...res.data.data.myComments];
        setCommentList(data);
      } else {
        setCommentList(res.data.data.myComments);
      }
      if (!isEmpty(res.data.data.myComments)) {
        setOffset((state) => state + 10);
      } else {
        setOffset(null);
      }
    }
  };

  const handleCommentRefresh = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      setCommentList(res.data.data.myComments);
      if (!isEmpty(res.data.data.myComments)) {
        setOffset(11);
      } else {
        setOffset(null);
      }
    }
  };

  const ref = useRef();

  // variables
  const snapPoints = [toSize(1), toSize(340), screenHeight];

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        opacity={0.6}
        onPress={() => Keyboard.dismiss()}
      />
    ),
    [],
  );

  const handleSheet = useCallback((index) => {
    ref.current.snapToIndex(index);
  }, []);

  const handleSheetChanges = (index) => {
    if (index < 1) {
      Keyboard.dismiss();
    }
  };

  return (
    <Screen type="view" toastText={toastText}>
      <AppHeader
        title={'작성글'}
        style={{ zIndex: 0 }}
        leftIcon={<MyIcon name="ic_close" size={toSize(14)} />}
        leftIconPress={() => RootNavigation.goBack()}
      />
      <AppTouchable
        style={styles.choice}
        onPress={() => handleSheet(1)}
        disabled={isEmpty(groupList)}
      >
        <AppText
          numberOfLines={1}
          size={20}
          weight={'medium'}
          color={isEmpty(groupList) ? colors.ColorC4C4C4 : colors.black}
          style={{
            maxWidth: screenWidth - toSize(70),
            marginRight: toSize(16),
          }}
        >
          {group.groupName}
        </AppText>
        {
          <MyIcon
            name={'ic_arrow_down'}
            size={toSize(10)}
            color={isEmpty(groupList) ? colors.ColorC4C4C4 : colors.black}
          />
        }
      </AppTouchable>

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

      {['리뷰', '일상', '작성댓글'].map((item, index) => {
        return (
          <MypageWrittenList
            key={`${item}+${index}`}
            data={
              type === '리뷰'
                ? reviewList
                : type === '일상'
                ? dailyList
                : commentList
            }
            visible={type === item}
            type={item}
            handleGetData={handleGetData}
            reviewSeq={reviewSeq}
            dailySeq={dailySeq}
            offset={offset}
          />
        );
      })}

      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backgroundStyle={{ borderRadius: 30 }}
        backdropComponent={renderBackdrop}
        keyboardBlurBehavior={'restore'}
        onChange={handleSheetChanges}
      >
        <AppText style={styles.groupChoice} size={20} weight={'medium'}>
          그룹 선택
        </AppText>
        <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
          {groupList?.map((e, i) => {
            return (
              <AppTouchable
                key={`meni_${i}`}
                style={styles.menu}
                onPress={() => {
                  setGroup(e);
                  ref.current.close();
                }}
              >
                <View
                  style={[
                    styles.check,
                    e.groupName === group.groupName && styles.activeCheck,
                  ]}
                >
                  <MyIcon
                    name={'ic_check_white'}
                    size={toSize(9)}
                    color={'white'}
                  />
                </View>
                <AppText
                  size={16}
                  weight={e.groupName === group.groupName && 'bold'}
                  color={
                    e.groupName === group.groupName
                      ? colors.primary
                      : colors.Color2D2F30
                  }
                >
                  {e.groupName}
                </AppText>
              </AppTouchable>
            );
          })}
        </BottomSheetScrollView>
      </BottomSheet>
    </Screen>
  );
};

export default ProfileWrittenScreen;

const styles = StyleSheet.create({
  choice: {
    maxHeight: toSize(34),
    flexDirection: 'row',
    marginTop: toSize(16),
    marginHorizontal: toSize(16),
    marginBottom: toSize(8),
    alignItems: 'center',
  },
  arrow: {
    width: toSize(14),
    height: toSize(14),
    marginLeft: toSize(21),
  },
  tabSection: {
    backgroundColor: colors.white,
    height: toSize(48),
    paddingHorizontal: toSize(16),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: colors.ColorE5E5E5,
    // marginBottom: toSize(18),
  },
  tabButton: {
    width: (screenWidth - toSize(48)) / 3,
    // paddingHorizontal: toSize(10),
    paddingVertical: toSize(12),
    borderBottomWidth: 2,
    borderColor: 'white',
    alignItems: 'center',
  },
  tabIndicator: {
    borderColor: colors.Color191919,
  },
  groupChoice: {
    marginTop: toSize(2),
    marginBottom: toSize(12),
    alignSelf: 'center',
  },
  contentContainer: {
    marginHorizontal: toSize(16),
  },
  menu: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: toSize(12),
    borderBottomWidth: 1,
    borderColor: colors.ColorF4F4F4,
  },
  check: {
    width: toSize(22),
    height: toSize(22),
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.ColorE5E5E5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: toSize(16),
  },
  activeCheck: {
    backgroundColor: colors.primary,
    borderWidth: 0,
  },
});
