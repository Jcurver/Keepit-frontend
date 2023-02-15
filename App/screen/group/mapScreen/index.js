import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '@gorhom/bottom-sheet';
import { useRef } from 'react';
import { Alert, Keyboard, StyleSheet, View } from 'react-native';
import WebView from 'react-native-webview';
import Svg from '../../../asset/svg';
import AppTextInput from '../../../component/common/appTextInput';
import AppTouchable from '../../../component/common/appTouchable';
import { hasNotch } from 'react-native-device-info';
import {
  colors,
  screenHeight,
  screenWidth,
  toSize,
} from '../../../config/globalStyle';
import MyIcon from '../../../config/icon-font';
import Screen from '../../Screen';
import RootNavigation from '../../../RootNavigation';
import { getMapReview } from './reviewMapfile';
import Geolocation from 'react-native-geolocation-service';
import useInterval from '../../../hook/useInterval';
import { mapHTML } from '../../review/mapScreen/mapHTML/index';
import { setAlertData } from '../../../store/feature/alertSlice';
import AppText from '../../../component/common/appText';
import AppModal from '../../../component/common/appModal';
import SearchMapPage from './SearchMapPage';
import { callApi } from '../../../function/auth';
import { getGroupMapPins } from '../../../api/map';
import { getMypageGroups } from '../../../api/myPage';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import useDebounce from '../../../hook/useDebounce';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomBottomSheet from './CustomBottomSheet';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useDispatch, useSelector } from 'react-redux';
import {
  setGroupNavigate,
  setMapData,
  setMapGroup,
  setMapRefresh,
} from '../../../store/feature/groupSlice';
import { useFocusEffect } from '@react-navigation/native';
import store from '../../../store';
import { isEmpty } from 'lodash';
import BottomSheetBackdrop from '../../../component/login/customBackdrop';
import { setIds } from '../../../store/feature/userSlice';
import { getGroupIsDelete } from '../../../api/group';

const defaultPlaceData = {
  targetPosition: {},
  customMarkers: [],
  markers: [],
  myLatLng: {},
};

const GroupMapScreen = ({ route: { params }, navigation }) => {
  const insets = useSafeAreaInsets();
  const mapGroup = useSelector((state) => state.group.mapGroup);
  const [gpsClick, setGpsClick] = useState(false);
  const [zoomOutClick, setZoomOutClick] = useState(false);
  const webviewRef = useRef(null);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [onSearchPage, setOnSearchPage] = useState(false);
  const [submitSearchText, setSubmitSearchText] = useState(false);
  const [searchWord, setSearchWord] = useState(undefined);
  const [placeData, setPlaceData] = useState(defaultPlaceData);
  const [groupMapData, setGroupMapData] = useState([]);
  const [groupData, setGroupData] = useState();
  const [selectedGroup, setSelectedGroup] = useState();
  const [searchInterface, setSearchInterface] = useState('start');
  const [placeInput, setPlaceInput] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [bottomSheetData, setBottomSheetData] = useState();
  const [onBottomSheet, setOnBottomSheet] = useState(false);
  const [onTopSheet, setOnTopSheet] = useState(true);
  const [getWebviewData, setGetWebviewData] = useState({});
  const [visitVisible, setVisitVisible] = useState(false);
  const debounceGetWebviewData = useDebounce(getWebviewData, 300);
  const [isInputLoading, setIsInputLoading] = useState(false);
  const [isGroupDelete, setIsGroupDelete] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    navigation.addListener('focus', () => {
      setBottomSheetData(undefined);
      setOnTopSheet(true);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log('selectedGroup:: ', selectedGroup);
  useEffect(() => {
    const handleIsGroupDelete = (res) => {
      if (res.data.apiStatus.apiCode === 200) {
        setIsGroupDelete(res.data.data);
      }
    };
    if (selectedGroup?.groupId) {
      callApi(
        getGroupIsDelete,
        { groupId: selectedGroup?.groupId },
        handleIsGroupDelete,
      );
    }
  }, [selectedGroup?.groupId]);

  const ref = useRef();
  const hideTabBar = () => {
    navigation.setOptions({
      tabBarStyle: { display: 'none' },
    });
  };

  const showTabBar = () => {
    navigation.setOptions({
      tabBarStyle: { display: 'flex' },
    });
  };
  useEffect(() => {
    setIsInputLoading(true);
  }, [placeInput]);

  // variables
  const snapPoints = [toSize(1), toSize(372), screenHeight - toSize(35)];

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
      if (!onBottomSheet) {
        showTabBar();
      }
    }
  };

  // pinGroupData false일때 -> 장소 찾기
  const setPlaceDataToMap = (data, pinGroupData = false) => {
    console.log(data);
    let mapData;
    let mapDataOption = {};
    let inGroup = false;

    if (!data?.length) {
      mapData = [data];
    } else {
      mapData = data;
    }

    const markers = [];
    const customMarkers = [];

    let storeGroupMapData = store.getState().group.mapData;

    for (let i = 0; i < mapData.length; i++) {
      const idx = storeGroupMapData.findIndex(
        ({ placeId }) => Number(placeId) === Number(mapData[i].placeId),
      );
      if (idx > -1) {
        customMarkers.push({
          ...mapData[i],
          imageUrl: storeGroupMapData[idx]?.imageUrl,
        });
        if (i === 0) {
          mapDataOption = { inGroup: true };
        }
      } else {
        markers.push(mapData[i]);
      }
    }
    setPlaceData({
      customMarkers: pinGroupData ? mapData : customMarkers,
      targetPosition: pinGroupData ? {} : { ...mapData[0], ...mapDataOption },
      // markers: pinGroupData ? [] : !isEmpty(customMarkers) ? [] : [mapData[0]],
      markers,
      pinGroupData,
    });
  };

  const reqGeoPermission = async () => {
    const geolocationPermission = await Geolocation.requestAuthorization(
      'always',
    );
    console.log(geolocationPermission);
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

    if (data?.set) {
      Alert.alert("'hi");
    }
    if (data?.zoom_changed || data?.dragend) {
      setGpsClick(false);
      setZoomOutClick(false);
    }
    if (data?.dragend) {
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
    console.log('이거');
    if (
      // debounceGetWebviewData?.click &&
      debounceGetWebviewData.targetIndex > -1
    ) {
      console.log(debounceGetWebviewData);
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
      // setGetWebviewData((data) => {
      //   targetIndex: data?.targetIndex;
      // });
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

  useEffect(() => {
    if (onBottomSheet && bottomSheetData) {
      hideTabBar();
    } else {
      showTabBar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onBottomSheet, bottomSheetData]);

  const sendMessageToWebView = (postMessage) => {
    const sendData = JSON.stringify(postMessage);
    console.log('sendData');
    console.log(sendData);
    webviewRef?.current?.postMessage(sendData);
  };

  const sendFirstMessageToWebView = () => {
    if (store.getState().group.mapData) {
      setPlaceDataToMap(store.getState().group.mapData, true);
    }
  };

  useEffect(() => {
    if (placeData) {
      sendMessageToWebView(placeData);
    }
  }, [placeData]);

  // useFocusEffect(
  //   useCallback(() => {
  //     console.log('실행됨');
  //     if (placeData) {
  //       sendMessageToWebView(placeData);
  //     }
  //   }, [placeData]),
  // );

  const handleMapPinData = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      // setGroupMapData(res.data.data);
      dispatch(setMapData(res.data.data));
      sendFirstMessageToWebView();
      // sendMessageToWebView(res.data.data);
      // setPlaceDataToMap(res.data.data, true);
    }
  };

  const handleMapPinDataWithWeb = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      // setGroupMapData(res.data.data);
      dispatch(setMapData(res.data.data));
      setPlaceDataToMap(res.data.data, true);
    }
  };

  const handleGroup = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      setGroupData(res.data.data);
      if (res.data.data.length < 1) {
        // 팝업
        setVisitVisible(true);
      } else {
        res.data.data.forEach((e, i) => {
          if (e.groupId === store.getState().group.mapGroup?.groupId) {
            dispatch(setMapGroup(e));
            setSelectedGroup(e);
            callApi(getGroupMapPins, { groupId: e.groupId }, handleMapPinData);
          }
        });
        if (!store.getState().group.mapGroup) {
          dispatch(setMapGroup(res.data.data[0]));
          setSelectedGroup(res.data.data[0]);
          callApi(
            getGroupMapPins,
            { groupId: res.data.data[0].groupId },
            handleMapPinData,
          );
        }
      }
    }
  };

  useEffect(() => {
    if (selectedGroup) {
      dispatch(
        setIds({
          groupId: selectedGroup.groupId,
          groupName: selectedGroup.groupName,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGroup]);

  // 그룹 데이터 가져오기
  useFocusEffect(
    useCallback(() => {
      if (!store.getState().group.mapRefresh) {
        dispatch(setMapRefresh(true));
      } else {
        callApi(getMypageGroups, null, handleGroup);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

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
          <View style={[styles.flexRow, { paddingTop: insets.top }]}>
            <AppTouchable
              style={styles.groupchoose}
              onPress={() => {
                hideTabBar();
                handleSheet(1);
              }}
            >
              <AppText size={20} weight={'bold'}>
                {selectedGroup
                  ? selectedGroup?.groupName.length < 16
                    ? `${selectedGroup?.groupName}`
                    : `${selectedGroup?.groupName.substring(0, 15)}...`
                  : ''}
              </AppText>
              <MyIcon
                name={'ic_arrow_down'}
                style={{ marginLeft: toSize(16) }}
              />
            </AppTouchable>
            <View style={styles.row}>
              <AppTouchable
                style={[styles.searchView]}
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
              // setPlaceData(groupMapData);
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
              if (!gpsClick) {
                reqGeoPermission();
              }
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
          disabled={isGroupDelete}
          onPress={() => {
            // console.log(selectedGroup);
            // dispatch(
            //   setIds({
            //     groupId: selectedGroup.groupId,
            //     groupName: selectedGroup.groupName,
            //   }),
            // );
            RootNavigation.navigate('ReviewPostScreen', {
              groupId: selectedGroup.groupId,
              groupName: selectedGroup.groupName,
              fromScreen: 'MapScreen',
            });
          }}
          style={[
            styles.greenbutton,
            {
              bottom:
                onBottomSheet && bottomSheetData ? 260 + insets.bottom : 100,
            },
            isGroupDelete
              ? { backgroundColor: colors.ColorE5E5E5 }
              : styles.shadowBtn,
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
          <CustomBottomSheet
            bottomSheetData={bottomSheetData}
            isGroupDelete={isGroupDelete}
          />
        )}

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
          <BottomSheetScrollView
            contentContainerStyle={styles.contentContainer}
          >
            {groupData?.map((e, i) => {
              return (
                <AppTouchable
                  key={`meni_${i}`}
                  style={styles.menu}
                  onPress={() => {
                    showTabBar();
                    ref.current.close();
                    dispatch(setMapGroup(e));
                    setSelectedGroup(e);
                    callApi(
                      getGroupMapPins,
                      { groupId: e.groupId },
                      handleMapPinDataWithWeb,
                    );
                    setSearchInterface('start');
                    setPlaceInput('');
                    setSubmitSearchText('');
                    setOnBottomSheet(false);
                    setBottomSheetData(undefined);
                  }}
                >
                  <View
                    style={[
                      styles.check,
                      e.groupName === selectedGroup?.groupName &&
                        styles.activeCheck,
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
                    weight={e.groupName === selectedGroup?.groupName && 'bold'}
                    color={
                      e.groupName === selectedGroup?.groupName
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
      </View>
      <AppModal
        visible={visitVisible}
        icon={Svg('ic_groupVisit', { marginBottom: toSize(16) })}
        title={'그룹 참여 안내'}
        content={'지도를 이용하시려면 그룹에 참여해 주세요.'}
        rightButtonText={'그룹 탐험하기'}
        onPressRight={() => {
          setVisitVisible(false);
          dispatch(setGroupNavigate(true));
          RootNavigation.reset([{ name: 'Main' }]);
        }}
      />
    </Screen>
  );
};

export default GroupMapScreen;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: screenWidth + 6,
    // borderWidth: 5,
    // borderColor: colors.black,
  },
  groupchoose: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: toSize(12),
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contentContainer: {
    marginHorizontal: toSize(16),
  },
  groupChoice: {
    marginTop: toSize(2),
    marginBottom: toSize(12),
    alignSelf: 'center',
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
  flexRow: {
    position: 'absolute',
    marginRight: 2.6,
    backgroundColor: colors.white85,
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    width: WINDOW_WIDTH,
    paddingHorizontal: toSize(16),
    paddingBottom: toSize(12),
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    right: 2.6,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    elevation: 6,
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
    width: WINDOW_WIDTH - toSize(32),
    height: toSize(48),
    borderRadius: 999,
    alignItems: 'center',
    paddingHorizontal: toSize(17.33),
    flexDirection: 'row',
    borderWidth: toSize(1),
    borderColor: colors.ColorF4F4F4,
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

    // shadowColor: colors.primary,
    // shadowOffset: {
    //   width: 0,
    //   height: 4,
    // },
    // shadowOpacity: 0.5,
    // elevation: 5,
  },
  shadowBtn: {
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
