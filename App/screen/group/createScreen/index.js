import React, { useEffect, useState } from 'react';
import { Image, Keyboard, View, Switch, ActionSheetIOS } from 'react-native';
import { get, isEmpty } from 'lodash';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import GroupSearchCategoryButton from '../../../component/button/groupSearchCategoryButton';
import AppHeader from '../../../component/common/appHeader';
import AppText from '../../../component/common/appText';
import AppTextArea from '../../../component/common/appTextArea';
import AppTextInput from '../../../component/common/appTextInput';
import AppTouchable from '../../../component/common/appTouchable';
import GroupPickerModal from '../../../component/modal/groupPickerModal';
import { colors, globalStyle, toSize } from '../../../config/globalStyle';
import RootNavigation from '../../../RootNavigation';
import ImagePicker from 'react-native-image-crop-picker';
import Screen from '../../Screen';
import { styles } from './styles';
import { groupPasswordCheck } from '../../../function/validation';
import SettingLinking from '../../../component/common/settingLinking';
import Permissions, { PERMISSIONS } from 'react-native-permissions';
import { callApi } from '../../../function/auth';
import {
  getGroupsDetail,
  getGroupsExists,
  getMyGroups,
  patchGroups,
  postGroups,
} from '../../../api/group';
import { postImageServer } from '../../../function/image';
import { useRef } from 'react';
import MyIcon from '../../../config/icon-font';
import Svg from '../../../asset/svg';
import { image_medium } from '../../../constants/imageSize';
import Config from 'react-native-config';
import AppModal from '../../../component/common/appModal';

const GroupCreateScreen = ({ route }) => {
  const modify = get(route, 'params.modify');
  const groupId = get(route, 'params.groupId');
  const inMembers = get(route, 'params.inMembers');
  const [groupImage, setGroupImage] = useState(null);
  const [title, setTitle] = useState();
  const [beforeTitle, setBeforeTitle] = useState();
  const [titleError, setTitleError] = useState(false);
  const [detail, setDetail] = useState();
  const [detailError, setDetailError] = useState(false);
  const [category, setCategory] = useState('MEETING');
  const [password, setPassword] = useState();
  const [passwordError, setPasswordError] = useState();
  const [selectedPeople, setSelectedPeople] = useState('10');
  const [isEnabled, setIsEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [warnVisible, setWarnVisible] = useState(false);
  const [image, setImage] = useState(false);
  const [nameTest, setNameTest] = useState(true);
  const [isApiLoading, setIsApiLoading] = useState(false);

  const scrollViewRef = useRef();

  useEffect(() => {
    if (modify) {
      callApi(getGroupsDetail, groupId, handleGroupData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGroupData = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      setTitle(res.data.data.name);
      setBeforeTitle(res.data.data.name);
      setDetail(res.data.data.description);
      setCategory(res.data.data.category);
      setSelectedPeople(res.data.data.memberQuantity);
      if (res.data.data.usePrivate) {
        setIsEnabled(true);
        setPassword(res.data.data.password);
      }
      if (res.data.data.profileUrl) {
        setGroupImage(res.data.data.profileUrl);
      }
    }
  };

  const handleSubmit = (res) => {
    setIsApiLoading(false);
    if (
      res.data.apiStatus.apiCode === 201 ||
      res.data.apiStatus.apiCode === 200
    ) {
      if (modify) {
        RootNavigation.goBack();
      } else {
        callApi(getMyGroups, { type: 'ALL' }, handleMine);
      }
    } else if (res.data.apiStatus.apiCode === 600) {
      setTitleError('?????? ?????? ???????????????.');
    } else if (res.data.apiStatus.apiCode === 999) {
      setTitleError('?????? ????????? ???????????? ????????????.');
    } else if (res.data.apiStatus.apiCode === 807) {
      setWarnVisible(true);
    }
  };

  const handleMine = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      const temp = res.data.data.groupList;
      temp.forEach((e) => {
        if (e.name === title) {
          RootNavigation.reset([
            { name: 'Main' },
            {
              name: 'GroupHomeScreen',
              params: {
                groupId: e.groupId,
                toastText: '????????? ??????????????????!',
              },
            },
          ]);
        }
      });
    }
  };

  const handleTitle = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      setNameTest(false);
    } else if (res.data.apiStatus.apiCode === 600) {
      setTitleError('?????? ???????????? ???????????????.');
      setNameTest(true);
    }
  };

  const handleTitleSubmit = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      setNameTest(false);
      setIsApiLoading(true);
      submit();
    } else if (res.data.apiStatus.apiCode === 600) {
      setTitleError('?????? ???????????? ???????????????.');
      setNameTest(true);
    }
  };

  const toggleSwitch = (state) => {
    setIsEnabled((previousState) => !previousState);
    scrollViewRef.current.scrollToEnd();
    if (!state) {
      setPassword();
      setPasswordError();
    }
  };

  const options = ['??????', '???????????? ??????', '?????? ????????? ??????'];

  const handleOpenGallery = () => {
    Permissions.request(PERMISSIONS.IOS.PHOTO_LIBRARY).then((res) => {
      if (res === 'granted' || res === 'limited') {
        ImagePicker.openPicker({
          compressImageQuality: 0.8,
          mediaType: 'photo',
          includeExif: true,
          multiple: false,
          maxFiles: 1,
          forceJpg: true,
          compressImageMaxWidth: 1300,
        })
          .then((pics) => {
            setGroupImage(null);
            setImage({
              uri: 'file://' + pics.path,
              type: pics.mime,
              name: 'image.jpeg',
            });
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        SettingLinking({ title: '?????????' });
      }
    });
  };

  const onPress = () =>
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: groupImage || image ? options : options.slice(0, 2),
        destructiveButtonIndex: groupImage || image ? 2 : undefined,
        cancelButtonIndex: 0,
        userInterfaceStyle: 'light',
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          console.log('cancel');
        } else if (buttonIndex === 1) {
          handleOpenGallery();
        } else if (buttonIndex === 2) {
          setImage(null);
          setGroupImage(null);
        }
      },
    );

  const submit = () => {
    var apiData = {
      name: title,
      description: detail,
      password: password ? password : undefined,
      usePrivate: isEnabled,
      memberQuantity: selectedPeople,
      category: category,
    };
    if (modify) {
      if (image || groupImage) {
        if (groupImage) {
          apiData.profileUrl = groupImage;
          callApi(patchGroups, { data: apiData, groupId }, handleSubmit);
        } else {
          postImageServer(image, 'group').then((res) => {
            if (res) {
              apiData.profileUrl = res.data;
              callApi(patchGroups, { data: apiData, groupId }, handleSubmit);
            }
          });
        }
      } else {
        callApi(patchGroups, { data: apiData, groupId }, handleSubmit);
      }
    } else {
      if (image) {
        postImageServer(image, 'group').then((res) => {
          if (res) {
            apiData.profileUrl = res.data;
            callApi(postGroups, apiData, handleSubmit);
          }
        });
      } else {
        callApi(postGroups, apiData, handleSubmit);
      }
    }
  };

  return (
    <Screen>
      <AppHeader
        leftIcon={Svg('ic_back')}
        leftIconPress={() => RootNavigation.goBack()}
        title={modify ? '?????? ?????? ??????' : '?????? ?????????'}
      />
      <KeyboardAwareScrollView
        ref={scrollViewRef}
        extraScrollHeight={toSize(60)}
        keyboardShouldPersistTaps={'handled'}
      >
        <AppTouchable
          style={[
            styles.imageContainer,
            !image && styles.emptyContainer,
            image && { backgroundColor: colors.ColorC9CBCE },
          ]}
          onPress={onPress}
        >
          {image || groupImage ? (
            <>
              <Image
                style={styles.groupImage}
                source={{
                  uri: groupImage
                    ? `${Config.IMAGE_SERVER_URI}/${groupImage}${image_medium}`
                    : image.uri,
                }}
              />
              <View style={styles.temp}>
                <MyIcon
                  name={'ic_camera'}
                  size={toSize(24)}
                  color={colors.white}
                />
              </View>
            </>
          ) : (
            <>
              <MyIcon
                name={'keepit_logo'}
                size={toSize(40)}
                color={colors.ColorF4F4F4}
              />
              <View style={styles.temp}>
                <MyIcon
                  name={'ic_camera'}
                  size={toSize(24)}
                  color={colors.white}
                />
              </View>
            </>
          )}
        </AppTouchable>
        <View style={styles.container}>
          <AppText weight={'medium'}>*?????? ??????</AppText>
          <View
            style={[
              styles.titleContainer,
              titleError && { borderColor: colors.ColorFF0000 },
            ]}
          >
            <AppTextInput
              style={{ flex: 1 }}
              placeholder={'?????? ?????? 20???'}
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                setNameTest(true);
                if (text.length === 0) {
                  setTitleError('?????? ?????? ???????????????.');
                } else if (text.length < 4) {
                  setTitleError('?????? ????????? 4??? ?????? ??????????????????.');
                } else {
                  setTitleError();
                }
              }}
              onBlur={() => {
                if (title?.length === 0 || !title) {
                  setTitleError('?????? ?????? ???????????????.');
                } else if (title?.length < 4) {
                  setTitleError('?????? ????????? 4??? ?????? ??????????????????.');
                } else {
                  if (modify && title === beforeTitle) {
                    setNameTest(false);
                  } else if (nameTest) {
                    callApi(getGroupsExists, title, handleTitle);
                  }
                }
              }}
              maxLength={20}
            />
            <View style={styles.textContainer}>
              <AppText size={12} color={colors.ColorC4C4C4}>
                {title?.length ?? 0}
              </AppText>
              <AppText size={12} color={colors.ColorC4C4C4}>
                {' / 20'}
              </AppText>
            </View>
          </View>
          <View style={styles.error}>
            {titleError && (
              <AppText size={11} color={colors.ColorF0102B}>
                {titleError}
              </AppText>
            )}
          </View>
          <AppText weight={'medium'}>*?????? ??????</AppText>
          <AppTextArea
            value={detail}
            onChangeText={(text) => {
              setDetail(text);
              if (text.length === 0) {
                setDetailError('?????? ?????? ???????????????.');
              } else if (text.length < 10) {
                setDetailError('?????? ????????? 10??? ?????? ??????????????????.');
              } else {
                setDetailError();
              }
            }}
            style={[
              { marginTop: toSize(7) },
              detailError && { borderColor: colors.ColorFF0000 },
            ]}
            textStyle={{ fontSize: toSize(16) }}
            placeholder={'??????????????? ??????????????????.'}
            maximumInput={200}
          />
          <View style={styles.error}>
            {detailError && (
              <AppText size={11} color={colors.ColorF0102B}>
                {detailError}
              </AppText>
            )}
          </View>
          <AppText weight={'medium'}>* ?????? ?????? ?????????</AppText>
          <AppTouchable style={styles.count} onPress={() => setVisible(true)}>
            <View style={globalStyle.flexRowCenter}>
              <AppText size={16}>{selectedPeople + '  '}</AppText>
              <AppText size={16}>???</AppText>
            </View>
            <MyIcon name={'ic_arrow_down'} />
          </AppTouchable>
          <AppText weight={'medium'}>* ????????????</AppText>
          <View style={styles.categoryContainer}>
            <GroupSearchCategoryButton
              light
              title={'??????'}
              active={category === 'MEETING'}
              onPress={() => setCategory('MEETING')}
              disabled={modify}
            />
            <GroupSearchCategoryButton
              light
              title={'??????'}
              active={category === 'RESTAURANT'}
              onPress={() => setCategory('RESTAURANT')}
              disabled={modify}
            />
            <GroupSearchCategoryButton
              light
              title={'??????'}
              active={category === 'REGION'}
              onPress={() => setCategory('REGION')}
              disabled={modify}
            />
            <GroupSearchCategoryButton
              light
              title={'??????/??????'}
              active={category === 'HOBBY'}
              onPress={() => setCategory('HOBBY')}
              disabled={modify}
            />
          </View>
          <AppText weight={'medium'}>????????? ??????</AppText>
          <Switch
            style={{ marginTop: toSize(10), marginBottom: toSize(18) }}
            trackColor={{ false: colors.ColorC4C4C4, true: colors.primary }}
            thumbColor={'white'}
            ios_backgroundColor={colors.ColorC4C4C4}
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
          {isEnabled && (
            <>
              <AppText size={16}>* ???????????? ??????</AppText>
              <AppTextInput
                boxStyle={[
                  { marginTop: toSize(10) },
                  passwordError && { borderColor: colors.ColorFF0000 },
                ]}
                placeholder={'???????????? ??????'}
                value={password}
                maxLength={8}
                onChangeText={(text) => {
                  setPassword(text);
                  if (text.length === 0) {
                    setPasswordError('?????? ?????? ???????????????.');
                  } else if (!groupPasswordCheck(text)) {
                    setPasswordError(
                      '??????????????? ?????? , ?????? 4~8?????? ?????? ?????????????????????.',
                    );
                  } else {
                    setPasswordError();
                  }
                }}
              />
              <View style={styles.error}>
                {passwordError && (
                  <AppText size={11} color={colors.ColorF0102B}>
                    {passwordError}
                  </AppText>
                )}
              </View>
            </>
          )}
          <AppTouchable
            button
            style={[
              styles.queryButton,
              (isEmpty(title) ||
                isEmpty(detail) ||
                titleError ||
                detailError ||
                (isEnabled ? isEmpty(password) || passwordError : false)) && {
                backgroundColor: colors.ColorC4C4C4,
              },
            ]}
            disabled={
              isEmpty(title) ||
              isEmpty(detail) ||
              titleError ||
              detailError ||
              (isEnabled ? isEmpty(password) || passwordError : false) ||
              isApiLoading
            }
            onPress={() => {
              if (nameTest) {
                if (beforeTitle && title === beforeTitle) {
                  setIsApiLoading(true);
                  submit();
                } else {
                  callApi(getGroupsExists, title, handleTitleSubmit);
                }
              } else {
                setIsApiLoading(true);
                submit();
              }
            }}
          >
            <AppText size={18} weight={'bold'} color={colors.white}>
              ??????
            </AppText>
          </AppTouchable>
        </View>
      </KeyboardAwareScrollView>

      <GroupPickerModal
        visible={visible}
        setVisible={setVisible}
        selectedPeople={selectedPeople}
        setSelectedPeople={setSelectedPeople}
        inMembers={inMembers}
      />

      <AppModal
        visible={warnVisible}
        icon={
          <MyIcon
            name={'ic_warn'}
            size={toSize(42)}
            style={{ marginBottom: toSize(16) }}
          />
        }
        title={'??? ?????? ????????? ?????? ??? ??? ????????????.'}
        content={'?????? ?????? ?????? 10??? ??????'}
        rightButtonText={'??????'}
        onPressRight={() => setWarnVisible(false)}
      />
    </Screen>
  );
};

export default GroupCreateScreen;
