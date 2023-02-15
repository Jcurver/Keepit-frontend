import React, { useEffect, useRef, useState } from 'react';
import Screen from '../../Screen';
import AppHeader from 'component/common/appHeader';
import MyIcon from 'config/icon-font';
import { styles } from './style';
import AppTextInput from 'component/common/appTextInput';
import { View } from 'react-native';
import { colors, toSize } from 'config/globalStyle';
import AppTouchable from 'component/common/appTouchable';
import axios from 'axios';
import Config from 'react-native-config';
import { ScrollView } from 'react-native-gesture-handler';
import AppText from 'component/common/appText';
import includeWordToGreen from 'function/includeWordToGreen';
import { callApi } from 'function/auth';
import { postPlace } from 'api/place';
import Svg from '../../../asset/svg';
import useDebounce from '../../../hook/useDebounce';
import RootNavigation from '../../../RootNavigation';

const ReviewMapSearchScreen = ({
  route: { params },
  navigation: { navigate },
}) => {
  const oldFormData = { ...params.form };
  const [placeInput, setPlaceInput] = useState('');
  const [searchPage, setSearchPage] = useState(1);
  const [searchWord, setSearchWord] = useState();
  const [searchListArr, setSearchListArr] = useState([]);
  const [isGetLastPage, setIsGetLastPage] = useState(false);
  const [oldPlaceFirstDataId, setOldPlaceFirstDataId] = useState(-1);
  const debouncePlaceInput = useDebounce(placeInput.replaceAll(' ', ''), 300);
  console.log('searchListArr:: ', searchListArr);
  const inputRef = useRef();
  useEffect(() => {
    if (debouncePlaceInput) {
      setSearchPage(1);
      searchKakaoAPI(true);
      setSearchWord(debouncePlaceInput);
    } else {
      setSearchWord(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncePlaceInput]);

  const searchKakaoAPI = (isNewWord) => {
    axios
      .get(
        `https://dapi.kakao.com/v2/local/search/keyword.json?page=${
          isNewWord ? searchPage : searchPage + 1
        }&size=15&sort=accuracy&query=${encodeURI(placeInput)}`,
        {
          headers: {
            Authorization: `KakaoAK ${Config.KAKAO_REST_API_KEY}`,
          },
        },
      )
      .then((res) => {
        const getPlaceData = res.data.documents.map((placeData) => {
          console.log('P::', placeData);
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
        console.log('sames');

        if (isNewWord) {
          // setOldPlaceFirstDataId(getPlaceData[0].placeId);
          setSearchListArr([...getPlaceData]);
          setIsGetLastPage(false);
        } else {
          if (oldPlaceFirstDataId === getPlaceData[0].placeId) {
            console.log('same');
            setIsGetLastPage(true);
            return;
          }
          console.log('not same');

          setOldPlaceFirstDataId(getPlaceData[0].placeId);
          setSearchListArr([...searchListArr, ...getPlaceData]);
          setSearchPage((page) => page + 1);
        }
      })
      .catch((error) => console.log('error:: ', error));
  };

  const handleNavigate = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      navigate('ReviewPostScreen', {
        ...oldFormData,
        nowPage: params?.nowPage,
        selectedPlace: res.config.data,
        fromScreen: 'ReviewMapSearchScreen',
        fromDetailScreen: params.fromDetailScreen,
        // explain: params?.form?.explain,
      });
    } else {
      console.log('장소 선택에 에러가 발생했습니다.');
    }
  };

  return (
    <Screen>
      <AppHeader
        title="장소 등록"
        leftIcon={Svg('back_thin')}
        leftIconPress={() => RootNavigation.goBack()}
        titleType="center"
        style={styles.headerStyle}
      />

      <View style={styles.searchView}>
        <MyIcon
          name={'ic_search'}
          size={toSize(20)}
          color={colors.ColorC4C4C4}
        />
        <AppTextInput
          autoFocus={true}
          inputRef={inputRef}
          value={placeInput}
          onChangeText={setPlaceInput}
          placeholder="찾는 장소 이름을 입력해주세요"
          style={styles.searchInput}
          placeholderTextColor={colors.ColorC4C4C4}
          returnKeyType="search"
          onSubmitEditing={() => {
            setSearchPage(1);
            setSearchListArr([]);
            searchKakaoAPI(true);
            setSearchWord(placeInput);
          }}
        />
        <AppTouchable
          style={styles.ereaseButton}
          onPress={() => {
            setPlaceInput('');
            setSearchWord(undefined);
            inputRef.current.focus();
          }}
        >
          <MyIcon name="ic_close" size={toSize(8)} color={colors.ColorEEEEEE} />
        </AppTouchable>
      </View>

      {searchWord === undefined ? null : searchListArr.length ? (
        <ScrollView
          scrollEventThrottle={0}
          onScroll={(e) => {
            let paddingToBottom = 1;
            paddingToBottom += e.nativeEvent.layoutMeasurement.height;
            // console.log(Math.floor(paddingToBottom) + "-" + Math.floor(e.nativeEvent.contentOffset.y) + "-" + Math.floor(e.nativeEvent.contentSize.height));
            if (
              !isGetLastPage &&
              e.nativeEvent.contentOffset.y + paddingToBottom >=
                e.nativeEvent.contentSize.height
            ) {
              searchKakaoAPI(false);
            }
          }}
        >
          {searchListArr.map((placeInfo, index) => {
            return (
              <>
                <AppTouchable
                  key={index}
                  style={styles.placeSearchView}
                  onPress={() => callApi(postPlace, placeInfo, handleNavigate)}
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
              </>
            );
          })}
        </ScrollView>
      ) : (
        <View style={styles.noPlaceSearchView}>
          <AppText>장소 검색 결과가 없어요. 검색어를</AppText>
          <AppText>정확하게 입력했는지 확인해보세요.</AppText>
        </View>
      )}
    </Screen>
  );
};

export default ReviewMapSearchScreen;
