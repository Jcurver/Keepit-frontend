import React, { useCallback, useEffect, useRef, useState } from 'react';
import AppHeader from '../../../component/common/appHeader';
import RootNavigation from '../../../RootNavigation';
import Screen from '../../Screen';
import MyIcon from '../../../config/icon-font';
import { get } from 'lodash';
import { callApi } from '../../../function/auth';
import {
  getGroupsHome,
  getGroupsMembers,
  postMembersFollow,
} from '../../../api/group';
import { colors, globalStyle, toSize } from '../../../config/globalStyle';
import AnimatedHeader from '../../../component/common/animatedHeader';
import { handleTitleOpacity, initialScroll } from '../../../function/header';
import { Animated, Image, View } from 'react-native';
import { styles } from './styles';
import AppText from '../../../component/common/appText';
import GroupTab from '../../../component/group/tab';
import AppTouchable from '../../../component/common/appTouchable';
import GroupMainList from '../../../component/group/mainList';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AppModal from '../../../component/common/appModal';
import { useSelector } from 'react-redux';
import jwt_decode from 'jwt-decode';
import Svg from '../../../asset/svg';
import updateSameText from '../../../function/updateSameText';
import AppImage from '../../../component/common/appImage';
import { image_small } from '../../../constants/imageSize';
import Config from 'react-native-config';
import { postMembersBlock } from '../../../api/user';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const GroupUserScreen = ({ route: { params } }) => {
  const insets = useSafeAreaInsets();
  const groupId = params.groupId;
  const mid = params.mid;
  const isRefresh = params.isRefresh;
  const fromHome = params.fromHome;
  const MID = useSelector((state) => state.user.authInfo.MID);
  const [data, setData] = useState();
  const [isDelete, setIsDelete] = useState();
  const [blockVisible, setBlockVisible] = useState(false);
  const [follow, setFollow] = useState();
  const [type, setType] = useState('리뷰');
  const [reviewCount, setReviewCount] = useState();
  const [dailyCount, setDailyCount] = useState();
  const [toastText, setToastText] = useState();
  const [fromHomeSave, setFromHomeSave] = useState(false);
  const [doRefresh, setDoRefresh] = useState(false);
  const [profileUrl, setProfileUrl] = useState(false);
  const [quit, setQuit] = useState(false);

  const navigation = useNavigation();

  // 네비게이션 이동 감지
  useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        if (e.data.action.type === 'NAVIGATE' || !fromHome) {
          return;
        }
        e.preventDefault();
        RootNavigation.navigate('GroupHomeScreen', {
          groupId,
          isRefresh: false,
        });
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [navigation],
  );

  useEffect(() => {
    if (params.fromHome) {
      setFromHomeSave(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (isRefresh) {
        setDoRefresh(true);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isRefresh]),
  );

  const tabData = [
    { title: '리뷰', onPress: () => setType('리뷰'), active: type === '리뷰' },
    { title: '일상', onPress: () => setType('일상'), active: type === '일상' },
  ];

  const reviewScrollY = useRef(new Animated.Value(0)).current;
  const dailyScrollY = useRef(new Animated.Value(0)).current;
  const scrollY = type === '리뷰' ? reviewScrollY : dailyScrollY;
  const collapsibleHeaderHeight = toSize(107);
  const tabHeight = toSize(57);
  let clampScrollValue = 0;
  let scrollValue = 0;

  useEffect(() => {
    if (type === '리뷰') {
      dailyScrollY.setValue(0);
    } else if (type === '일상') {
      reviewScrollY.setValue(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  useFocusEffect(
    useCallback(() => {
      callApi(getGroupsHome, groupId, handleGroupHome);
      callApi(getGroupsMembers, { groupId, memberId: mid }, handleGroup);
      initialScroll(
        scrollY,
        collapsibleHeaderHeight,
        scrollValue,
        clampScrollValue,
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [groupId, mid]),
  );

  const handleGroupHome = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      setIsDelete(res.data.data.isDelete);
    }
  };

  const handleGroup = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      console.log(res.data.data);
      setData(res.data.data);
      setProfileUrl(res.data.data.profileUrl);
      setFollow(res.data.data.isFollow);
    } else if (res.data.apiStatus.apiCode === 704) {
      setQuit(true);
    }
  };

  const handleFavorite = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      setFollow(true);
      setToastText((text) => updateSameText('멤버가 팔로우 되었어요.', text));
    }
  };

  const handleFavoriteUnlike = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      setFollow(false);
      setToastText((text) => updateSameText('멤버가 언팔로우 되었어요.', text));
    }
  };

  const handleBlock = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      console.log('success');
      RootNavigation.goBack();
    }
  };

  return (
    <Screen
      toastMargin
      toastText={toastText}
      type={'view'}
      style={{ paddingTop: 0 }}
      topSafeArea={false}
    >
      <Animated.View
        style={[
          styles.header,
          { height: insets.top + toSize(42), paddingTop: insets.top },
        ]}
      >
        <AppTouchable
          style={[styles.icon, { marginLeft: toSize(16) }]}
          onPress={() => {
            if (fromHomeSave) {
              RootNavigation.navigate('GroupHomeScreen', {
                groupId,
                isRefresh: params.isRefresh ? true : false,
              });
            } else {
              RootNavigation.goBack();
            }
          }}
        >
          {Svg('back_thin')}
        </AppTouchable>
        {!quit && (
          <Animated.View
            style={{
              marginLeft: MID !== mid && toSize(40),
              marginRight: MID === mid && toSize(30),
              opacity: handleTitleOpacity(scrollY, collapsibleHeaderHeight),
            }}
          >
            <AppText size={16}>
              {data?.name.length > 12
                ? data?.name.substring(0, 12) + '...'
                : data?.name}
            </AppText>
          </Animated.View>
        )}

        {!quit && (
          <View style={globalStyle.flexRowCenter}>
            {MID !== mid && (
              <AppTouchable
                style={[styles.icon, { marginRight: toSize(24) }]}
                onPress={() => setBlockVisible(true)}
              >
                {Svg('ic_block')}
              </AppTouchable>
            )}
            {MID !== mid && (
              <AppTouchable
                style={[styles.icon, { marginRight: toSize(16) }]}
                disabled={isDelete}
                onPress={() =>
                  callApi(
                    postMembersFollow,
                    { groupId, targetMid: mid },
                    follow ? handleFavoriteUnlike : handleFavorite,
                  )
                }
              >
                {isDelete ? (
                  Svg('ic_star_empty_delete')
                ) : follow ? (
                  <MyIcon
                    name={'ic_star'}
                    size={toSize(20)}
                    color={colors.ColorFEE500}
                  />
                ) : (
                  Svg('ic_star_empty_black')
                )}
              </AppTouchable>
            )}
          </View>
        )}
      </Animated.View>

      {quit ? (
        <View style={styles.quit}>
          {Svg('exclamation_mark')}
          <AppText
            size={16}
            color={colors.Color6B6A6A}
            style={{ marginTop: toSize(24) }}
          >
            존재하지 않거나 탈퇴한 멤버에요.
          </AppText>
        </View>
      ) : (
        <>
          <AnimatedHeader
            style={{
              marginTop: toSize(42) + insets.top,
            }}
            headerHeight={collapsibleHeaderHeight}
            translateHeight={collapsibleHeaderHeight}
            scrollY={scrollY}
          >
            <View style={styles.headerContainer}>
              <AppImage
                source={{
                  uri: `${Config.IMAGE_SERVER_URI}/${profileUrl}${image_small}`,
                }}
                style={styles.profile}
                icon={'profile_empty'}
                size={31}
                color={colors.ColorAEE9D2}
              />
              <View style={{ flex: 1 }}>
                <AppText size={16}>{data?.name}</AppText>
              </View>
            </View>
          </AnimatedHeader>

          <AnimatedHeader
            style={{
              marginTop: toSize(42) + collapsibleHeaderHeight + insets.top,
            }}
            headerHeight={tabHeight}
            translateHeight={collapsibleHeaderHeight}
            scrollY={scrollY}
            opacity={0}
          >
            <GroupTab
              tabData={tabData}
              reviewCount={reviewCount}
              dailyCount={dailyCount}
            />
          </AnimatedHeader>

          {['리뷰', '일상'].map((item, index) => {
            return (
              <GroupMainList
                key={`groupInfo_${index}`}
                isDelete={isDelete}
                visible={type === item}
                type={item}
                tabData={tabData}
                scrollY={scrollY}
                groupId={groupId}
                reviewCount={reviewCount}
                dailyCount={dailyCount}
                setReviewCount={setReviewCount}
                setDailyCount={setDailyCount}
                setToastText={setToastText}
                collapsibleHeaderHeight={collapsibleHeaderHeight}
                targetId={mid}
                isRefresh={isRefresh}
                fromUser
                fromDetail
              />
            );
          })}
        </>
      )}

      <AppModal
        visible={blockVisible}
        title={'차단하시겠어요?'}
        content={'차단하면 차단한 멤버의 글이 보이지않아요.'}
        leftButtonText={'취소'}
        onPressLeft={() => setBlockVisible(false)}
        rightButtonText={'차단하기'}
        onPressRight={() => {
          setBlockVisible(false);
          callApi(postMembersBlock, { groupId, targetMid: mid }, handleBlock);
        }}
      />
    </Screen>
  );
};

export default GroupUserScreen;
