import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Image, ScrollView, View } from 'react-native';
import AppText from '../../../component/common/appText';
import AppTouchable from '../../../component/common/appTouchable';
import { colors, images, toSize } from '../../../config/globalStyle';
import Screen from '../../Screen';
import RootNavigation from '../../../RootNavigation';
import { styles } from './styles';
import GroupSearchCategoryButton from '../../../component/button/groupSearchCategoryButton';
import GroupVerticalBox from '../../../component/group/groupVerticalBox';
import GroupInfoBox from '../../../component/group/infoBox';
import MyIcon from '../../../config/icon-font';
import { callApi } from '../../../function/auth';
import { getGroupsAll, getGroupsStatistics } from '../../../api/group';
import { get } from 'lodash';
import Svg from '../../../asset/svg';

const SearchMainScreen = ({ route }) => {
  const myGroupData = get(route, 'params.groupData');
  const myGroupFavoriteData = get(route, 'params.favoriteGroupData');
  const [category, setCategory] = useState('ALL');
  const [recommendData, setRecommendData] = useState(null);
  const [popularData, setPopularData] = useState(null);
  const [reviewData, setReviewData] = useState(null);
  const [groupData, setGroupData] = useState();
  const [groupData2, setGroupData2] = useState();
  const [extend, setExtend] = useState();
  console.log('groupData:: ', groupData);

  const recListRef = useRef();
  const popularListRef = useRef();
  const ListRef = useRef();
  const nullData = [null, null, null, null, null, null, null, null, null, null];

  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }) => {
    return layoutMeasurement.height + contentOffset.y >= contentSize.height;
  };

  useEffect(() => {
    setRecommendData(null);
    setPopularData(null);
    setReviewData(null);
    setGroupData(null);
    callApi(
      getGroupsStatistics,
      { category: category, referralType: 'POPULARITY' },
      handlePopular,
    );
    callApi(
      getGroupsStatistics,
      { category: category, referralType: 'MANYREVIEW' },
      handleReview,
    );
    callApi(
      getGroupsStatistics,
      { category: category, referralType: 'RECOM' },
      handleRecom,
    );
    recListRef.current?.scrollToOffset({ animated: true, offset: 0 });
    popularListRef.current?.scrollToOffset({ animated: true, offset: 0 });
    ListRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  }, [category]);

  useEffect(() => {
    callApi(getGroupsAll, { pageSize: 20 }, handleData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const handlePopular = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      setPopularData(res.data.data);
    }
  };
  const handleReview = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      setReviewData(res.data.data);
    }
  };
  const handleRecom = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      setRecommendData(res.data.data);
    }
  };
  const handleData = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      setGroupData(res.data.data.groupList);
      callApi(
        getGroupsAll,
        { pageSize: 20, lastGroupId: res.data.data.lastGroupSeq },
        handleSecondData,
      );
    }
  };

  const handleSecondData = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      setGroupData2(res.data.data.groupList);
    }
  };

  const onPress = (item) => {
    var isJoin = false;
    myGroupData.forEach((e) => {
      if (e.groupId === item.groupId) {
        isJoin = true;
      }
    });
    myGroupFavoriteData.forEach((e) => {
      if (e.groupId === item.groupId) {
        isJoin = true;
      }
    });
    if (isJoin) {
      RootNavigation.navigate('GroupHomeScreen', {
        groupId: item.groupId,
      });
    } else {
      RootNavigation.navigate('JoinScreen', {
        groupId: item.groupId,
      });
    }
  };

  return (
    <Screen>
      <View style={styles.header}>
        <AppTouchable
          style={styles.backBtn}
          onPress={() => RootNavigation.goBack()}
        >
          {Svg('back_thin')}
        </AppTouchable>
        <AppTouchable
          style={styles.searchBar}
          onPress={() => RootNavigation.navigate('SearchScreen')}
        >
          <MyIcon
            name={'ic_search'}
            size={toSize(20)}
            color={colors.ColorC4C4C4}
          />
          <AppText
            style={{ marginLeft: toSize(16) }}
            size={16}
            color={colors.ColorC4C4C4}
          >
            찾는 키워드, 카테고리로 검색
          </AppText>
        </AppTouchable>
      </View>
      <View>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.menuContent}
          style={styles.menu}
          horizontal={true}
        >
          <GroupSearchCategoryButton
            title={'전체'}
            style={{ marginLeft: toSize(18) }}
            active={category === 'ALL'}
            onPress={() => setCategory('ALL')}
          />
          <GroupSearchCategoryButton
            title={'모임'}
            active={category === 'MEETING'}
            onPress={() => setCategory('MEETING')}
          />
          <GroupSearchCategoryButton
            title={'맛집'}
            active={category === 'RESTAURANT'}
            onPress={() => setCategory('RESTAURANT')}
          />
          <GroupSearchCategoryButton
            title={'지역'}
            active={category === 'REGION'}
            onPress={() => setCategory('REGION')}
          />
          <GroupSearchCategoryButton
            title={'취미/레저'}
            active={category === 'HOBBY'}
            onPress={() => setCategory('HOBBY')}
          />
        </ScrollView>
      </View>
      <ScrollView
        ref={ListRef}
        onScroll={({ nativeEvent }) => {
          if (
            isCloseToBottom(nativeEvent) &&
            groupData &&
            groupData[0]?.groupId !== groupData2[0]?.groupId
          ) {
            setExtend(true);
          }
        }}
        scrollEventThrottle={4}
      >
        <View style={styles.recommandContainer}>
          <AppText
            weight={'medium'}
            size={18}
            style={{ marginBottom: toSize(12) }}
            isData={recommendData}
            noStyle
            viewStyle={{ padding: 0, marginBottom: toSize(12) }}
            sWidth={164}
            sHeight={24}
          >
            추천 그룹
          </AppText>
          <FlatList
            ref={recListRef}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={recommendData ? recommendData : nullData}
            keyExtractor={(item, index) => `groupRec${index}`}
            renderItem={({ item }) => (
              <GroupVerticalBox
                myGroupData={myGroupData}
                myGroupFavoriteData={myGroupFavoriteData}
                onPress={() => {
                  if (item) {
                    onPress(item);
                  }
                }}
                data={item}
              />
            )}
          />
        </View>

        <View style={styles.popularContainer}>
          <AppText
            weight={'medium'}
            size={18}
            style={{ marginBottom: toSize(12) }}
            isData={popularData}
            noStyle
            viewStyle={{ padding: 0, marginBottom: toSize(12) }}
            sWidth={164}
            sHeight={24}
          >
            지금 가장 인기있는 그룹
          </AppText>

          <FlatList
            ref={popularListRef}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={popularData ? popularData : nullData}
            keyExtractor={(item, index) => `groupPop${index}`}
            renderItem={({ item }) => (
              <GroupVerticalBox
                myGroupData={myGroupData}
                myGroupFavoriteData={myGroupFavoriteData}
                onPress={() => {
                  if (item) {
                    onPress(item);
                  }
                }}
                data={item}
              />
            )}
          />
        </View>
        <View style={styles.popularContainer}>
          <AppText
            weight={'medium'}
            size={18}
            style={{ marginBottom: toSize(12) }}
            isData={reviewData}
            noStyle
            viewStyle={{ padding: 0, marginBottom: toSize(12) }}
            sWidth={164}
            sHeight={24}
          >
            리뷰 많은 그룹
          </AppText>
          {(reviewData ? reviewData : nullData)?.map((item, index) => {
            return (
              <GroupInfoBox
                myGroupData={myGroupData}
                myGroupFavoriteData={myGroupFavoriteData}
                onPress={() => {
                  if (item) {
                    onPress(item);
                  }
                }}
                key={`groupReview${index}`}
                data={item}
              />
            );
          })}
        </View>
        <View style={styles.popularContainer}>
          <AppText
            weight={'medium'}
            size={18}
            style={{ marginBottom: toSize(12) }}
            isData={reviewData}
            noStyle
            viewStyle={{ padding: 0, marginBottom: toSize(12) }}
            sWidth={164}
            sHeight={24}
          >
            그룹
          </AppText>
          {(groupData ? groupData : nullData)?.length > 1 &&
            groupData?.map((item, index) => {
              return (
                <GroupInfoBox
                  myGroupData={myGroupData}
                  myGroupFavoriteData={myGroupFavoriteData}
                  onPress={() => {
                    if (item) {
                      onPress(item);
                    }
                  }}
                  key={`groupInfo${index}`}
                  data={item}
                />
              );
            })}
          {extend &&
            groupData2?.map((item, index) => {
              return (
                <GroupInfoBox
                  myGroupData={myGroupData}
                  myGroupFavoriteData={myGroupFavoriteData}
                  onPress={() => {
                    if (item) {
                      onPress(item);
                    }
                  }}
                  key={`groupInfo${index}`}
                  data={item}
                />
              );
            })}
        </View>
      </ScrollView>
    </Screen>
  );
};

export default SearchMainScreen;
