import React, { useEffect, useState } from 'react';
import { View, Image, ImageBackground, Alert, ScrollView } from 'react-native';
import AppText from '../../../component/common/appText';
import AppTouchable from '../../../component/common/appTouchable';
import AppHeader from '../../../component/common/appHeader';
import {
  colors,
  toSize,
  images,
  globalStyle,
  screenWidth,
} from '../../../config/globalStyle';
import RootNavigation from '../../../RootNavigation';
import Screen from '../../Screen';
import { styles } from './styles';
import MyIcon from '../../../config/icon-font';
import { get, isEmpty } from 'lodash';
import { callApi } from '../../../function/auth';
import { getGroupsDetail, postGroupsJoin } from '../../../api/group';
import { typeTranslation } from '../../../function/etc';
import Config from 'react-native-config';
import Svg from '../../../asset/svg';
import { image_medium, image_small } from '../../../constants/imageSize';
import AppImage from '../../../component/common/appImage';
import LinearGradient from 'react-native-linear-gradient';
import AppModal from '../../../component/common/appModal';

const JoinScreen = ({ route }) => {
  const groupId = get(route, 'params.groupId');
  const [visible, setvisible] = useState(false);
  const [data, setData] = useState();
  const [masterData, setMasterData] = useState();
  const [groupExcess, setGroupExcess] = useState(false);
  const [quitVisible, setQuitVisible] = useState(false);
  const [isApiLoading, setIsApiLoading] = useState(false);

  useEffect(() => {
    callApi(getGroupsDetail, groupId, handleGroup);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGroup = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      setData(res.data.data);
      res.data.data.members.forEach((e) => {
        if (e.mid === res.data.data.master) {
          setMasterData(e);
        }
      });
    }
  };

  // 비밀번호 입력 알럿
  const alertButton = () =>
    Alert.prompt(
      '비밀번호 입력',
      '비밀번호 입력이 필요한 그룹입니다. 비밀번호를 입력해 주세요.',
      [
        {
          text: '취소',
          onPress: () => setIsApiLoading(false),
          style: 'cancel',
        },
        {
          text: '확인',
          onPress: (password) => {
            if (data.password === password) {
              const params = [data.groupId, { password: password }];
              callApi(postGroupsJoin, params, handleJoin);
            } else {
              setIsApiLoading(false);
              Alert.alert(
                '비밀번호가 일치하지 않아요',
                '영문/숫자 4~8자리로 입력해 주세요.',
                [
                  {
                    text: '확인',
                    onPress: () => console.log('cancel'),
                    style: 'cancel',
                  },
                ],
                { cancelable: false },
              );
            }
          },
        },
      ],
      'plain-text',
      //'영문/숫자 4-8자리',
    );

  const handleJoin = (res) => {
    setIsApiLoading(false);
    if (res.data.apiStatus.apiCode === 200) {
      RootNavigation.reset([
        { name: 'Main' },
        {
          name: 'GroupHomeScreen',
          params: { groupId: groupId, toastText: '그룹에 참여됐습니다!' },
        },
      ]);
    } else if (res.data.apiStatus.apiCode === 803) {
      setGroupExcess(true);
    } else if (res.data.apiStatus.apiCode === 804) {
      Alert.alert('해당 그룹의 멤버 수용 인원이 꽉 찼습니다.');
    } else if (res.data.apiStatus.apiCode === 818) {
      setQuitVisible(true);
    }
  };

  return (
    <Screen>
      <ScrollView style={styles.container}>
        <AppHeader
          style={{ position: 'absolute' }}
          leftIcon={
            <MyIcon name={'ic_back'} size={toSize(14)} color={'white'} />
          }
          leftIconPress={() => RootNavigation.goBack()}
        />
        {data?.profileUrl ? (
          <View style={{ width: screenWidth }}>
            <LinearGradient
              colors={[colors.black34, 'rgba(255,255,255,0)']}
              style={styles.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 100 / toSize(191) }}
            />
            <Image
              source={{
                uri: `${Config.IMAGE_SERVER_URI}/${data?.profileUrl}${image_medium}`,
              }}
              style={styles.backGroup}
            />
          </View>
        ) : (
          <View style={styles.empty}>
            <MyIcon
              name={'keepit_logo'}
              size={toSize(50)}
              color={colors.ColorF4F4F4}
            />
          </View>
        )}
        <View style={styles.contentContainer}>
          <View style={styles.category}>
            <AppText color={colors.primary}>
              {typeTranslation(data?.category)}
            </AppText>
          </View>
          <AppText style={styles.title} size={24} weight={'bold'}>
            {data?.name}
          </AppText>
          <View style={styles.circle}>
            <AppImage
              style={styles.profile}
              source={{
                uri: `${Config.IMAGE_SERVER_URI}/${masterData?.profileUrl}${image_small}`,
              }}
              icon={'profile_empty'}
              color={colors.ColorAEE9D2}
            />
            <AppText style={{ marginLeft: toSize(4) }}>
              {masterData?.name}
            </AppText>
          </View>

          <View style={styles.personNum}>
            <MyIcon name={'ic_twoperson'} size={toSize(24)} />
            <AppText style={{ marginLeft: toSize(8) }}>
              {`${data?.inMembers}/${data?.memberQuantity}명 참여중`}
            </AppText>
          </View>

          <AppText style={styles.content}>{data?.description}</AppText>
        </View>
      </ScrollView>

      <AppTouchable
        button
        style={styles.joinBtn}
        onPress={() => {
          if (!isApiLoading) {
            setIsApiLoading(true);
            if (data?.usePrivate) {
              alertButton();
            } else {
              const params = [data?.groupId];
              callApi(postGroupsJoin, params, handleJoin);
            }
          }
        }}
      >
        <View style={globalStyle.flexRowCenter}>
          {data?.usePrivate && (
            <MyIcon
              name={'ic_lock'}
              size={toSize(18)}
              color={'white'}
              style={{ marginRight: toSize(10) }}
            />
          )}
          <AppText weight={'bold'} size={16} color={colors.white}>
            참여하기
          </AppText>
        </View>
      </AppTouchable>

      <AppModal
        visible={groupExcess}
        icon={
          <MyIcon
            name={'ic_warn'}
            size={toSize(42)}
            style={{ marginBottom: toSize(16) }}
          />
        }
        title={'더 이상 그룹에 참여할 수 없어요.'}
        content={'그룹 참여 최대 20개 제한'}
        rightButtonText={'확인'}
        onPressRight={() => {
          setGroupExcess(false);
        }}
      />

      <AppModal
        visible={quitVisible}
        icon={
          <MyIcon
            name={'ic_warn'}
            size={toSize(42)}
            style={{ marginBottom: toSize(16) }}
          />
        }
        title={'참여 불가 안내'}
        content={
          '해당 그룹은 그룹장에 의해 강제 탈퇴 되어\n참여하실 수 없는 그룹입니다.'
        }
        rightButtonText={'확인'}
        onPressRight={() => {
          setQuitVisible(false);
        }}
      />
    </Screen>
  );
};

export default JoinScreen;
