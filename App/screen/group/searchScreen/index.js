import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Keyboard,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import AppText from '../../../component/common/appText';
import AppTouchable from '../../../component/common/appTouchable';
import { colors, toSize } from '../../../config/globalStyle';
import Screen from '../../Screen';
import RootNavigation from '../../../RootNavigation';
import { styles } from './styles';
import { useDispatch, useSelector } from 'react-redux';
import AppTextInput from '../../../component/common/appTextInput';
import MyIcon from '../../../config/icon-font';
import { isEmpty } from 'lodash';
import {
  removeSearchWordList,
  saveSearchWordList,
  setSearchWordList,
} from '../../../store/feature/groupSlice';
import GroupRecentSearchWord from '../../../component/group/recentSearchWord';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { callApi } from '../../../function/auth';
import { getGroupsSearch, getMyGroups } from '../../../api/group';
import GroupInfoBox from '../../../component/group/infoBox';
import { useFocusEffect } from '@react-navigation/native';
import jwt_decode from 'jwt-decode';
import Svg from '../../../asset/svg';

const SearchScreen = () => {
  const [search, setSearch] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [searchList, setSearchList] = useState([]);
  const [myGroupList, setMyGroupList] = useState([]);
  const [count, setCount] = useState(0);
  const [lastGroupId, setLastGroupId] = useState();
  const searchWordList = useSelector((state) => state.group.searchWordList);
  const MID = useSelector((state) => state.user.authInfo.MID);
  const dispatch = useDispatch();

  const ref = useRef();

  useEffect(() => {
    ref?.current?.focus();
    console.log('search' + MID);
    try {
      AsyncStorage.getItem('search' + MID).then((req) => {
        dispatch(setSearchWordList(JSON.parse(req)));
      });
    } catch (error) {
      console.log('error getting search word list', error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFocusEffect(
    useCallback(() => {
      const params = { type: 'ALL' };
      callApi(getMyGroups, params, handleGroupList);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const handleGroupList = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      setMyGroupList([
        ...res.data.data.groupList,
        ...res.data.data.favoriteGroupList,
      ]);
    }
  };

  useEffect(() => {
    setShowResult(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleSearch = (item) => {
    dispatch(saveSearchWordList([item, MID]));
    const params = {
      pageSize: 10,
      search: item,
    };
    callApi(getGroupsSearch, params, handleAfterSearch);
  };

  const handleAfterSearch = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      setLastGroupId(res.data.data.lastGroupSeq);
      setCount(res.data.data.totalCount);
      setSearchList(res.data.data.groupList);
      setShowResult(true);
    }
  };

  const handleAfterEnd = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      setLastGroupId(res.data.data.lastGroupSeq);
      setSearchList([...searchList, ...res.data.data.groupList]);
    }
  };

  return (
    <Screen>
      <View style={styles.header}>
        <AppTouchable
          style={styles.back}
          onPress={() => RootNavigation.goBack()}
        >
          {Svg('back_thin')}
        </AppTouchable>
        <View style={styles.searchBar}>
          <AppTextInput
            inputRef={ref}
            value={search}
            maxLength={20}
            onChangeText={(value) => setSearch(value)}
            style={{ flex: 1 }}
            placeholder={'검색어를 입력해주세요'}
            returnKeyType={'done'}
            onSubmitEditing={() => {
              search !== '' && handleSearch(search);
            }}
          />
          {!isEmpty(search) && (
            <AppTouchable onPress={() => setSearch('')}>
              <MyIcon
                name={'ic_cleartext'}
                size={toSize(17)}
                color={colors.Color6B6A6A}
              />
            </AppTouchable>
          )}
        </View>
      </View>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {!showResult ? (
          <View style={styles.container}>
            <View style={styles.menu}>
              <AppText size={16}>최근 검색어</AppText>
              {searchWordList.length > 0 && (
                <AppTouchable
                  onPress={() => {
                    dispatch(removeSearchWordList(MID));
                  }}
                >
                  <AppText color={colors.Color6B6A6A}>전체 삭제</AppText>
                </AppTouchable>
              )}
            </View>
            {isEmpty(searchWordList) ? (
              <View style={styles.emptyContainer}>
                <AppText style={{ marginBottom: toSize(50) }} size={16}>
                  최근 검색어 내역이 없어요
                </AppText>
              </View>
            ) : (
              <FlatList
                keyboardShouldPersistTaps={'handled'}
                data={searchWordList}
                renderItem={({ item, index }) => (
                  <GroupRecentSearchWord
                    data={item}
                    sub={MID}
                    onClickSearch={() => {
                      setSearch(item);
                      handleSearch(item);
                    }}
                  />
                )}
                keyExtractor={(item, index) => `groupList${index}`}
              />
            )}
          </View>
        ) : (
          <View style={[styles.container, { paddingTop: 0 }]}>
            {count === 0 ? (
              <View style={styles.emptyContainer}>
                <AppText size={16} style={styles.emptySearch}>
                  {`검색하신 '${search}'에 대한 결과가 없어요.검색어를 정확하게 입력했는지 확인해보세요.`}
                </AppText>
              </View>
            ) : (
              <View style={styles.resultContainer}>
                <AppText
                  size={12}
                  color={colors.Color6B6A6A}
                >{`결과 ${count}`}</AppText>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps={'handled'}
                  data={searchList}
                  keyExtractor={(item, index) => `groupSearchList${index}`}
                  renderItem={({ item }) => (
                    <GroupInfoBox
                      fromSearch
                      data={item}
                      onPress={() => {
                        var isJoin = false;
                        myGroupList.forEach((e) => {
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
                      }}
                    />
                  )}
                  onScrollBeginDrag={() => Keyboard.dismiss()}
                  onEndReached={() => {
                    if (lastGroupId) {
                      const params = {
                        pageSize: 20,
                        search: search,
                        lastGroupSeq: lastGroupId,
                      };
                      callApi(getGroupsSearch, params, handleAfterEnd);
                    }
                  }}
                />
              </View>
            )}
          </View>
        )}
      </TouchableWithoutFeedback>
    </Screen>
  );
};

export default SearchScreen;
