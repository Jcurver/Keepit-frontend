import { WINDOW_HEIGHT, WINDOW_WIDTH } from '@gorhom/bottom-sheet';
import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Svg from '../../../asset/svg';
import AppTextInput from '../../../component/common/appTextInput';
import AppTouchable from '../../../component/common/appTouchable';
import { colors, toSize } from '../../../config/globalStyle';
import MyIcon from 'config/icon-font';
import AppText from '../../../component/common/appText';
import axios from 'axios';
import Config from 'react-native-config';
import includeWordToGreen from 'function/includeWordToGreen';
import useDebounce from '../../../hook/useDebounce';
import {
  getSearchPlace,
  storeSearchPlace,
  popAndResetSearchPlace,
  storeClearSearchPlace,
} from '../../../config/searchPlaceStorage';

const SearchMapPage = ({
  placeInput,
  setPlaceInput,
  searchWord,
  setSearchWord,
  setOnSearchPage,
  setPlaceDataToMap,
  setSearchInterface,
  searchHistory,
  setSearchHistory,
  submitSearchText,
  setSubmitSearchText,
  setGpsClick,
}) => {
  const [searchPage, setSearchPage] = useState(1);
  const [searchListArr, setSearchListArr] = useState([]);
  const [isGetLastPage, setIsGetLastPage] = useState(false);
  const [oldPlaceFirstDataId, setOldPlaceFirstDataId] = useState(-1);
  const debouncePlaceInput = useDebounce(placeInput.replaceAll(' ', ''), 300);
  const [isLandingState, setIsLandingState] = useState(true);

  useEffect(() => {
    const getSearchHistory = async () => {
      const sHistory = await getSearchPlace();
      setSearchHistory(sHistory);
    };
    getSearchHistory();
  }, [setSearchHistory]);

  useEffect(() => {
    if (debouncePlaceInput) {
      setSearchPage(1);
      searchKakaoAPI({
        isNewWord: true,
        searchType: 'searchListUpdate',
        debouncePlaceInput,
      });
      setSearchWord(debouncePlaceInput);
    } else {
      setSearchWord(undefined);
      const getSearchHistory = async () => {
        const sHistory = await getSearchPlace();
        setSearchHistory(sHistory);
      };
      getSearchHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncePlaceInput]);

  const inputRef = useRef();

  const searchKakaoAPI = async ({
    isNewWord,
    searchType,
    historyPlaceName = undefined,
    debouncePlaceInput = undefined,
  }) => {
    let searchWordd = historyPlaceName
      ? historyPlaceName
      : debouncePlaceInput
      ? debouncePlaceInput
      : placeInput;
    if (searchWordd === '') {
      return;
    }
    await axios
      .get(
        `https://dapi.kakao.com/v2/local/search/keyword.json?page=${
          isNewWord ? searchPage : searchPage + 1
        }&size=15&sort=accuracy&query=${encodeURI(searchWordd)}`,
        {
          headers: {
            Authorization: `KakaoAK ${Config.KAKAO_REST_API_KEY}`,
          },
        },
      )
      .then((res) => {
        let getPlaceData = res?.data?.documents?.map((placeData) => {
          return {
            placeId: placeData.id,
            placeName: placeData.place_name,
            address: placeData.address_name,
            roadAddress: placeData.road_address_name,
            phone: placeData.phone,
            x: placeData.x,
            y: placeData.y,
            categoryName: placeData.category_name,
            categoryGroupCode: placeData.category_group_code,
          };
        });
        if (!getPlaceData) {
          getPlaceData = [];
        }
        switch (searchType) {
          case 'searchListUpdate':
            setSearchListArr([...getPlaceData]);
            setIsGetLastPage(false);
            break;
          case 'scrollToBottom':
            if (oldPlaceFirstDataId === getPlaceData[0].placeId) {
              setIsGetLastPage(true);
            } else {
              setOldPlaceFirstDataId(getPlaceData[0].placeId);
              setSearchListArr([...searchListArr, ...getPlaceData]);
              setSearchPage((page) => page + 1);
            }
            break;
          case 'onSubmitEditing':
            if (getPlaceData.length) {
              setOnSearchPage(false);
              storeSearchPlace({
                type: 'submit',
                placeName: placeInput,
                placeId: Math.floor(Math.random() * 10000000),
              });
              setSearchInterface('end');
            }
            setPlaceDataToMap(getPlaceData);
            setSearchListArr([...getPlaceData]);
            setIsGetLastPage(false);
            setSubmitSearchText(placeInput);
            // setGetWebviewData({ click: true });

            break;
          case 'clickHistoryTypeSubmit':
            setPlaceDataToMap(getPlaceData);
            storeSearchPlace({
              type: 'submit',
              placeName: historyPlaceName,
              placeId: Math.floor(Math.random() * 10000000),
            });
            setSearchListArr([...getPlaceData]);
            setIsGetLastPage(false);
            break;
        }
      })
      .catch((error) => console.log('error:: ', error));
  };

  return (
    <View style={[styles.searchPage]}>
      <View style={styles.searchView}>
        <AppTouchable
          style={styles.backButton}
          onPress={() => setOnSearchPage(false)}
        >
          {Svg('back_thin')}
        </AppTouchable>
        <View style={styles.inputView}>
          <AppTextInput
            inputRef={inputRef}
            maxLength={20}
            // defaultValue={submitSearchText}
            value={placeInput}
            onChangeText={(text) => {
              setIsLandingState(false);
              setPlaceInput(text);
            }}
            placeholder="장소를 검색해주세요"
            style={styles.input}
            returnKeyType="search"
            autoFocus={true}
            onSubmitEditing={async () => {
              if (placeInput === '' || searchListArr.length === 0) {
                return;
              } else {
                await searchKakaoAPI({
                  isNewWord: true,
                  searchType: 'onSubmitEditing',
                });
                setSearchPage(1);
                setSearchListArr([]);
                setSearchWord(placeInput);
                setGpsClick(false);
              }
            }}
          />
          {placeInput?.length > 0 && (
            <AppTouchable
              style={styles.ereaseButton}
              onPress={() => {
                setPlaceInput('');
                setSearchWord(undefined);
                inputRef.current.focus();
              }}
            >
              <MyIcon
                name="ic_close"
                size={toSize(8)}
                color={colors.ColorEEEEEE}
              />
            </AppTouchable>
          )}
        </View>
      </View>

      {searchWord === undefined || isLandingState ? (
        <>
          <View style={styles.recentSearchView}>
            <View>
              <AppText style={styles.recentSearch}>최근 검색어</AppText>
            </View>
            <AppTouchable
              onPress={async () => {
                setSearchHistory([]);
                // setSearchInterface('end');
                await storeClearSearchPlace();
              }}
            >
              <AppText
                size={14}
                style={styles.recentSearch}
                color={colors.Color6B6A6A}
              >
                전체 삭제
              </AppText>
            </AppTouchable>
          </View>
          <ScrollView bounces={false}>
            {searchHistory.length > 0 ? (
              searchHistory.map((historyData) => {
                return (
                  <View key={historyData.placeId}>
                    <View style={styles.recentSearchListView}>
                      <AppTouchable
                        onPress={async () => {
                          setSubmitSearchText(historyData.placeName);
                          setPlaceInput(historyData.placeName);
                          setSearchInterface('end');
                          if (historyData.type === 'select') {
                            await storeSearchPlace(historyData);
                            await setPlaceDataToMap(historyData);
                          } else if (historyData.type === 'submit') {
                            await searchKakaoAPI({
                              isNewWord: true,
                              historyPlaceName: historyData.placeName,
                              searchType: 'clickHistoryTypeSubmit',
                            });
                          }
                          setSearchWord(historyData.placeName);
                          setGpsClick(false);
                          setOnSearchPage(false);
                        }}
                        style={styles.recentPlaceClickArea}
                      >
                        <View style={styles.historyIconView}>
                          {historyData?.type === 'submit'
                            ? Svg('recent_search')
                            : Svg('recent_pin')}
                        </View>
                        <AppText style={{ paddingLeft: toSize(16) }}>
                          {historyData?.placeName}
                        </AppText>
                      </AppTouchable>
                      <AppTouchable
                        style={styles.recentPlaceCloseArea}
                        onPress={async () => {
                          const popAndResetHistoryPlaceData =
                            await popAndResetSearchPlace(historyData.placeId);
                          setSearchHistory(popAndResetHistoryPlaceData);
                        }}
                      >
                        {Svg('close_gray')}
                      </AppTouchable>
                    </View>
                    <View style={styles.grayline} />
                  </View>
                );
              })
            ) : (
              <View style={styles.recentSearchListArea}>
                <AppText>최근 검색어 내역이 없어요</AppText>
              </View>
            )}
          </ScrollView>
        </>
      ) : searchListArr?.length ? (
        <ScrollView
          bounces={false}
          scrollEventThrottle={0}
          onScroll={(e) => {
            let paddingToBottom = 1;
            paddingToBottom += e.nativeEvent.layoutMeasurement.height;
            if (
              !isGetLastPage &&
              e.nativeEvent.contentOffset.y + paddingToBottom >=
                e.nativeEvent.contentSize.height
            ) {
              searchKakaoAPI({ isNewWord: false, type: 'scrollToBottom' });
            }
          }}
        >
          {searchListArr.map((placeInfo, index) => {
            return (
              <View key={placeInfo.placeId + 'search'}>
                <AppTouchable
                  key={index}
                  style={styles.placeSearchView}
                  onPress={async () => {
                    await storeSearchPlace(
                      Object.assign(placeInfo, { type: 'select' }),
                    );
                    await setPlaceDataToMap(placeInfo);
                    setPlaceInput(placeInfo.placeName);
                    setSearchHistory(placeInfo);

                    setSearchWord(placeInfo?.placeName);
                    setGpsClick(false);
                    setOnSearchPage(false);

                    setSubmitSearchText(placeInfo.placeName);

                    // callApi(postPlace, placeInfo, handleNavigate);
                  }}
                >
                  <View style={styles.flexRow}>
                    {includeWordToGreen(searchWord, placeInfo.placeName)}
                  </View>
                  <AppText color={colors.ColorA7A7A7}>
                    {placeInfo.roadAddress !== ''
                      ? placeInfo.roadAddress
                      : placeInfo.address}
                  </AppText>
                </AppTouchable>
                <View style={styles.grayline} />
              </View>
            );
          })}
        </ScrollView>
      ) : (
        <View style={styles.noPlaceSearchView}>
          <AppText>장소 검색 결과가 없어요. 검색어를</AppText>
          <AppText>정확하게 입력했는지 확인해보세요.</AppText>
        </View>
      )}
    </View>
  );
};

export default SearchMapPage;

const styles = StyleSheet.create({
  searchPage: {
    width: WINDOW_WIDTH,
    height: '100%',
    backgroundColor: 'white',
  },
  searchView: {
    width: '100%',
    height: toSize(58),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: toSize(48),
    height: toSize(48),
    marginHorizontal: toSize(3.5),
  },
  inputView: {
    height: toSize(42),
    width: WINDOW_WIDTH - toSize(71),
    borderWidth: 1,
    borderColor: colors.ColorE5E5E5,
    borderRadius: 999,
    paddingLeft: toSize(16),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    width: WINDOW_WIDTH - toSize(151),
  },
  ereaseButton: {
    width: toSize(17),
    height: toSize(17),
    borderRadius: 999,
    backgroundColor: colors.Color6B6A6A,
    right: toSize(16),
    justifyContent: 'center',
    alignItems: 'center',
  },

  noPlaceSearchView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: toSize(158),
  },
  placeSearchView: {
    flex: 1,
    paddingHorizontal: toSize(17),
    height: toSize(77),
    justifyContent: 'center',
  },
  flexRow: {
    flexDirection: 'row',
  },
  grayline: {
    backgroundColor: colors.ColorF4F4F4,
    width: WINDOW_WIDTH - toSize(32),
    height: toSize(1),
    marginHorizontal: toSize(16),
  },
  recentSearch: {
    paddingVertical: toSize(8),
    paddingHorizontal: toSize(16),
  },
  recentSearchView: {
    width: WINDOW_WIDTH,
    height: toSize(40),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recentSearchListArea: {
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT - toSize(143),
    paddingBottom: toSize(300),
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentSearchListView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recentPlaceClickArea: {
    flexDirection: 'row',
    alignItems: 'center',
    width: toSize(330),
    height: toSize(56),
    paddingHorizontal: toSize(16),
    paddingVertical: toSize(12),
  },
  recentPlaceCloseArea: {
    paddingHorizontal: toSize(16),
    paddingVertical: toSize(12),
  },
  historyIconView: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 24,
    height: 24,
  },
});
