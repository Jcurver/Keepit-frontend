import React, { useEffect, useState } from 'react';
import { WINDOW_WIDTH } from '@gorhom/bottom-sheet';
import { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import WebView from 'react-native-webview';
import Svg from '../../../asset/svg';
import AppTouchable from '../../../component/common/appTouchable';
import { colors, screenWidth, toSize } from '../../../config/globalStyle';
import MyIcon from '../../../config/icon-font';
import Screen from '../../Screen';
import RootNavigation from '../../../RootNavigation';
import Geolocation from 'react-native-geolocation-service';
import { mapHTML } from './mapHTML';
import AppText from '../../../component/common/appText';
import SearchMapPage from './SearchMapPage';
import { callApi } from '../../../function/auth';
import { getGroupMapPins } from '../../../api/map';
import useDebounce from '../../../hook/useDebounce';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomSheet from './BottomSheet';
import { getGroupIsDelete } from '../../../api/group';

const defaultPlaceData = {
  targetPosition: {},
  customMarkers: [],
  markers: [],
  myLatLng: {},
};

const ReviewMapScreen = ({ route: { params } }) => {
  const insets = useSafeAreaInsets();
  const [gpsClick, setGpsClick] = useState(false);
  const [zoomOutClick, setZoomOutClick] = useState(false);
  const webviewRef = useRef(null);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [onSearchPage, setOnSearchPage] = useState(false);
  const [submitSearchText, setSubmitSearchText] = useState(false);
  const [searchWord, setSearchWord] = useState(undefined);
  const [placeData, setPlaceData] = useState(defaultPlaceData);
  const [groupMapData, setGroupMapData] = useState([]);
  const [reviewDetailTargetIndex, setReviewDetailTargetIndex] = useState(0);
  const [searchInterface, setSearchInterface] = useState();
  const [placeInput, setPlaceInput] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [bottomSheetData, setBottomSheetData] = useState();
  const [onBottomSheet, setOnBottomSheet] = useState(false);
  const [onTopSheet, setOnTopSheet] = useState(true);
  const [getWebviewData, setGetWebviewData] = useState({});
  const debounceGetWebviewData = useDebounce(getWebviewData, 300);
  const [isInputLoading, setIsInputLoading] = useState(false);
  const [isGroupDelete, setIsGroupDelete] = useState(false);

  console.log('placeData:: ', placeData);
  console.log('groupMapData:: ', groupMapData);

  useEffect(() => {
    setIsInputLoading(true);
  }, [placeInput]);

  const setPlaceDataToMap = (data, pinGroupData = false) => {
    if (data === undefined) {
      return;
    }
    let mapData;
    let mapDataOption = {};

    if (typeof data === 'object' && data?.length === undefined) {
      mapData = [data];
    } else if (typeof data === 'object' && data?.length > -1) {
      mapData = data;
    }
    const markers = [];
    const customMarkers = [];

    for (let i = 0; i < mapData.length; i++) {
      const idx = groupMapData.findIndex(
        ({ placeId }) => Number(placeId) === Number(mapData[i].placeId),
      );
      if (idx > -1) {
        customMarkers.push({
          ...mapData[i],
          imageUrl: groupMapData[idx]?.imageUrl,
        });
        if (i === 0) {
          mapDataOption = { inGroup: true };
        }
      } else {
        markers.push(mapData[i]);
      }
    }
    setPlaceData({
      customMarkers,
      targetPosition: { ...mapData[0], ...mapDataOption },
      markers,
      pinGroupData,
    });
  };

  const reqGeoPermission = async () => {
    const geolocationPermission = await Geolocation.requestAuthorization(
      'always',
    );
    if (geolocationPermission === 'granted') {
      Geolocation.getCurrentPosition(
        (position) => {
          sendMessageToWebView({
            ...placeData,
            myLatLng: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
          });
        },
        (error) => {
          console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    }
  };

  const handleOnMessageFromWebView = (e) => {
    const data = JSON.parse(e.nativeEvent.data);
    if (data?.zoom_changed || data?.dragend) {
      setGpsClick(false);
      setZoomOutClick(false);
    }
    if (Number(data?.targetIndex) > -1) {
      setGetWebviewData((prev) => ({ ...prev, ...data }));
    }
    if (data?.click) {
      setGetWebviewData((prev) => ({ ...prev, click: true }));
    }
    if (data?.doubleClick) {
      setGetWebviewData((prev) => ({ ...prev, doubleClick: true }));
    } else {
      setGetWebviewData((prev) => ({ ...prev, doubleClick: false }));
    }
  };

  useEffect(() => {
    if (debounceGetWebviewData.targetIndex > -1) {
      setOnTopSheet(true);
      setOnBottomSheet(true);
      if (debounceGetWebviewData?.type === 'customMarkers') {
        setBottomSheetData(
          placeData.customMarkers[debounceGetWebviewData.targetIndex],
        );
      } else if (debounceGetWebviewData?.type === 'markers') {
        setBottomSheetData(
          placeData.markers[debounceGetWebviewData.targetIndex],
        );
      }
      setIsInputLoading(false);
    } else if (
      debounceGetWebviewData?.click &&
      !debounceGetWebviewData?.targetIndex &&
      !debounceGetWebviewData?.doubleClick
    ) {
      setOnTopSheet((d) => !d);
      setOnBottomSheet((d) => !d);
    }
    setGetWebviewData({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    debounceGetWebviewData?.targetIndex,
    debounceGetWebviewData?.click,
    debounceGetWebviewData?.doubleClick,
    searchWord,
  ]);

  const sendMessageToWebView = (postMessage) => {
    const sendData = JSON.stringify(postMessage);
    webviewRef?.current?.postMessage(sendData);
  };

  const sendFirstMessageToWebView = () => {
    if (!params?.targetPlaceId) {
      setPlaceDataToMap(groupMapData, true);
    } else if (groupMapData && reviewDetailTargetIndex > -1) {
      setPlaceDataToMap({
        ...groupMapData[reviewDetailTargetIndex],
        targetPosition: Object.assign(groupMapData[reviewDetailTargetIndex], {
          inGroup: true,
        }),
      });
    }
  };

  useEffect(() => {
    if (placeData) {
      console.log(placeData);
      sendMessageToWebView(placeData);
    }
  }, [placeData]);

  useEffect(() => {
    const handleMapPinData = (res) => {
      console.log('res:: ', res.data.data);
      if (res.data.apiStatus.apiCode === 200) {
        const placeArr = res.data.data;
        console.log('placdArr:: ', placeArr);
        setGroupMapData(placeArr);
        if (params?.targetPlaceId) {
          const idx = placeArr.findIndex(
            ({ placeId }) => placeId === params?.targetPlaceId,
          );
          setReviewDetailTargetIndex(idx);
          setTimeout(() => {
            setSearchInterface('start');
          }, 500);
        } else {
          setSearchInterface('start');
        }
      }
    };
    const handleIsGroupDelete = (res) => {
      if (res.data.apiStatus.apiCode === 200) {
        setIsGroupDelete(res.data.data);
      }
    };
    if (params?.groupId) {
      callApi(getGroupMapPins, { groupId: params?.groupId }, handleMapPinData);
      callApi(
        getGroupIsDelete,
        { groupId: params?.groupId },
        handleIsGroupDelete,
      );
    }
  }, [params]);

  return (
    <Screen type="view" topSafeArea={onSearchPage}>
      <View style={[styles.view, { marginTop: -3 }]}>
        <WebView
          ref={webviewRef}
          onLoadEnd={sendFirstMessageToWebView}
          onMessage={handleOnMessageFromWebView}
          automaticallyAdjustContentInsets={false}
          originWhitelist={['*']}
          source={{
            html: mapHTML,
          }}
        />
        {searchInterface === 'start' && onTopSheet && (
          <View style={[styles.flexRow, { top: insets.top + toSize(8) }]}>
            <AppTouchable
              style={[styles.goback, styles.shadow]}
              onPress={() => {
                RootNavigation.goBack();
              }}
            >
              {Svg('back_thin')}
            </AppTouchable>
            <AppTouchable
              style={[styles.searchView, styles.shadow]}
              onPress={() => {
                setOnSearchPage(true);
                setOnBottomSheet(false);
              }}
            >
              {Svg('search_thin')}
              <View style={styles.input}>
                <AppText color={colors.ColorC4C4C4}>
                  장소를 검색해주세요
                </AppText>
              </View>
            </AppTouchable>
          </View>
        )}
        {searchInterface === 'end' && onTopSheet && (
          <View
            style={{
              position: 'absolute',
              backgroundColor: 'white',
              width: '100%',
              paddingTop: insets.top,
              height: toSize(72) + insets.top,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View style={styles.interfaceEndSearchView}>
              <AppTouchable
                onPress={() => {
                  if (!isInputLoading) {
                    setOnSearchPage(true);
                    setOnBottomSheet(false);
                  }
                }}
                style={{
                  width: toSize(280),
                  paddingVertical: toSize(10),
                  marginLeft: toSize(16),
                }}
              >
                <AppText>{submitSearchText}</AppText>
              </AppTouchable>
              <AppTouchable
                onPress={() => {
                  setSearchInterface('start');
                  sendFirstMessageToWebView();
                  setPlaceDataToMap(groupMapData, true);
                  setPlaceInput('');
                  setSubmitSearchText('');
                  setOnBottomSheet(false);
                  setBottomSheetData(undefined);
                }}
                style={{ padding: toSize(6), marginRight: toSize(16) }}
              >
                {Svg('search_close')}
              </AppTouchable>
            </View>
          </View>
        )}
        <AppTouchable
          style={[
            styles.option,
            styles.shadow,
            {
              bottom:
                onBottomSheet && bottomSheetData ? 394 + insets.bottom : 234,
            },
          ]}
          onPress={() => {
            if (!isButtonLoading) {
              setSearchInterface('start');
              sendFirstMessageToWebView();
              setPlaceDataToMap(groupMapData, true);
              setPlaceInput('');
              setSubmitSearchText('');
              setOnBottomSheet(false);
              setBottomSheetData(undefined);
              setIsButtonLoading(true);
              setGpsClick(false);
              setTimeout(() => {
                setIsButtonLoading(false);
                setZoomOutClick(true);
              }, 300);
            }
          }}
        >
          {zoomOutClick ? Svg('spot_green') : Svg('spot')}
        </AppTouchable>
        <AppTouchable
          style={[
            styles.option,
            styles.shadow,
            {
              bottom:
                onBottomSheet && bottomSheetData ? 340 + insets.bottom : 180,
            },
          ]}
          onPress={() => {
            if (!isButtonLoading) {
              setIsButtonLoading(true);
              reqGeoPermission();
              setZoomOutClick(false);
              setTimeout(() => {
                setIsButtonLoading(false);
                setGpsClick(true);
              }, 300);
            }
          }}
        >
          {gpsClick ? Svg('qrcode_green') : Svg('qrcode')}
        </AppTouchable>
        <AppTouchable
          onPress={() => {
            if (!isGroupDelete) {
              RootNavigation.navigate('ReviewPostScreen', {
                fromScreen: 'MapScreen',
              });
            }
          }}
          style={[
            styles.greenbutton,
            {
              bottom:
                onBottomSheet && bottomSheetData ? 260 + insets.bottom : 100,
            },
            isGroupDelete && {
              backgroundColor: colors.ColorE5E5E5,
              shadowColor: colors.ColorE5E5E5,
            },
          ]}
        >
          <MyIcon size={toSize(24)} color={colors.white} name={'ic_write'} />
        </AppTouchable>
        {onSearchPage && (
          <SearchMapPage
            placeInput={placeInput}
            setPlaceInput={setPlaceInput}
            searchWord={searchWord}
            setSearchWord={setSearchWord}
            setOnSearchPage={setOnSearchPage}
            setPlaceDataToMap={setPlaceDataToMap}
            setSearchInterface={setSearchInterface}
            searchHistory={searchHistory}
            setSearchHistory={setSearchHistory}
            submitSearchText={submitSearchText}
            setSubmitSearchText={setSubmitSearchText}
            setGpsClick={setGpsClick}
          />
        )}
        {onBottomSheet && bottomSheetData && (
          <BottomSheet
            bottomSheetData={bottomSheetData}
            isGroupDelete={isGroupDelete}
          />
        )}
      </View>
    </Screen>
  );
};

export default ReviewMapScreen;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: screenWidth + 6,

    // borderWidth: 5,
    // borderColor: colors.black,
  },
  start: {
    backgroundColor: colors.primary,
    marginHorizontal: toSize(34),
    marginBottom: toSize(10),
  },
  view: {
    position: 'relative',
    width: screenWidth + 9,
    marginLeft: -2.6,
    // marginTop: -3,
    height: '101%',
  },
  start2: {
    backgroundColor: colors.primary,
    marginHorizontal: toSize(34),
    marginBottom: toSize(40),
  },
  flexRow: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: WINDOW_WIDTH,
    paddingHorizontal: toSize(16),
    height: toSize(48),
    // top: statusBarHeight + toSize(42),
  },
  goback: {
    width: toSize(48),
    height: toSize(48),
    borderRadius: 999,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchView: {
    width: WINDOW_WIDTH - toSize(95),
    height: toSize(48),
    borderRadius: 999,
    alignItems: 'center',
    paddingHorizontal: toSize(17.33),
    flexDirection: 'row',

    backgroundColor: 'white',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
  },
  input: {
    width: WINDOW_WIDTH - toSize(175),
    marginLeft: toSize(15),
    marginTop: toSize(1.1),
  },
  option: {
    position: 'absolute',
    right: toSize(16),
    width: toSize(42),
    height: toSize(42),
    borderRadius: 999,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  greenbutton: {
    backgroundColor: colors.primary,
    width: toSize(56),
    height: toSize(56),
    position: 'absolute',
    right: toSize(17),
    // bottom: toSize(76),
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    elevation: 5,
  },
  searchPage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'blue',
    zIndex: 10,
  },
  interfaceEndSearchView: {
    borderRadius: 999,
    width: WINDOW_WIDTH - toSize(32),
    height: toSize(48),
    borderWidth: 1,
    borderColor: colors.ColorF4F4F4,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  bottomSheetContainer: {
    position: 'absolute',
    width: WINDOW_WIDTH + 3,
    // height: toSize(223.23),
    backgroundColor: 'white',
    bottom: 0,
    borderTopRightRadius: toSize(24),
    borderTopLeftRadius: toSize(24),
    paddingVertical: toSize(24),
    paddingHorizontal: toSize(16),
  },
});
