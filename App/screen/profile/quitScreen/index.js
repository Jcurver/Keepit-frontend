import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';
import Svg from '../../../asset/svg';
import AppHeader from '../../../component/common/appHeader';
import BottomSheetBackdrop from '../../../component/login/customBackdrop';
import AppText from '../../../component/common/appText';
import AppTouchable from '../../../component/common/appTouchable';
import BottomSheet from '@gorhom/bottom-sheet';
import { colors, toSize } from '../../../config/globalStyle';
import RootNavigation from '../../../RootNavigation';
import Screen from '../../Screen';
import AppModal from '../../../component/common/appModal';
import { callApi } from '../../../function/auth';
import { postMembersWithdrawal } from '../../../api/user';
import {
  setAuthInfo,
  setUserSliceInit,
} from '../../../store/feature/userSlice';
import {
  setGroupSliceInit,
  setMapGroup,
} from '../../../store/feature/groupSlice';
import { setReviewSliceInit } from '../../../store/feature/reviewSlice';
import { logout } from '../../../function/logout';

const ProfileQuitScreen = () => {
  const [reason, setReason] = useState('비매너 사용자를 만났어요.');
  const [quitVisible, setQuitVisible] = useState('비매너 사용자를 만났어요.');
  const dispatch = useDispatch();
  const ref = useRef();
  const reasonList = [
    '비매너 사용자를 만났어요.',
    '새 계정을 만들고 싶어요.',
    '찾는 그룹이 없어요.',
    '서비스 기능이 불편해요',
  ];

  // variables
  const snapPoints = [toSize(1), toSize(250)];

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

  const handleWithdrawal = (res) => {
    if (res.data.apiStatus.apiCode === 200) {
      setQuitVisible(true);
    }
  };

  return (
    <Screen type={'view'}>
      <AppHeader
        leftIcon={Svg('ic_backBtn')}
        leftIconPress={() => RootNavigation.goBack()}
      />
      <View style={styles.container}>
        <AppText style={{ marginBottom: toSize(12) }} size={24} weight={'bold'}>
          탈퇴안내
        </AppText>
        <AppText
          style={{ marginBottom: toSize(16), lineHeight: toSize(30) }}
          size={20}
        >
          {
            '탈퇴 후 7일간 재가입이 불가능해요.\n해당 계정의 게시글은 전부 삭제되며\n재가입 시 복구되지 않아요.'
          }
        </AppText>
      </View>

      <View style={styles.seperator} />

      <View style={styles.container}>
        <AppText
          style={{ marginBottom: toSize(16), lineHeight: toSize(30) }}
          size={20}
        >
          {
            '회원님의 불편사항을 알려주시면\n서비스 개선에 반영하도록 노력할게요.'
          }
        </AppText>
        <AppText size={16} weight={'medium'}>
          어떤점이 불편하셨나요?
        </AppText>
        <AppTouchable style={styles.reasonBox} onPress={() => handleSheet(1)}>
          <AppText size={16}>{reason}</AppText>
          {Svg('ic_arrow_down', styles.icon)}
        </AppTouchable>

        <View style={styles.btnContainer}>
          <AppTouchable
            style={styles.cancel}
            onPress={() => RootNavigation.goBack()}
          >
            <AppText
              style={styles.button}
              size={16}
              weight={'bold'}
              color={colors.primary}
            >
              취소
            </AppText>
          </AppTouchable>
          <AppTouchable
            style={styles.confirm}
            onPress={() => {
              callApi(postMembersWithdrawal, null, handleWithdrawal);
              logout(true);
            }}
          >
            <AppText
              style={styles.button}
              size={16}
              weight={'bold'}
              color={'white'}
            >
              탈퇴하기
            </AppText>
          </AppTouchable>
        </View>
      </View>

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
        <View style={styles.reasonContainer}>
          {reasonList.map((e, i) => {
            return (
              <AppTouchable
                key={`reason+${i}`}
                style={[styles.reason, i === 3 && { borderBottomWidth: 0 }]}
                onPress={() => {
                  setReason(e);
                  ref.current.close();
                }}
              >
                <AppText
                  size={16}
                  style={styles.reasonText}
                  color={e === reason ? colors.primary : colors.Color2D2F30}
                >
                  {e}
                </AppText>
              </AppTouchable>
            );
          })}
        </View>
      </BottomSheet>

      <AppModal
        visible={quitVisible}
        title={'탈퇴완료'}
        content={'이용해 주셔서 감사합니다.'}
        rightButtonText={'확인'}
        onPressRight={() => {
          setQuitVisible(false);
          dispatch(setAuthInfo(null));
          dispatch(setGroupSliceInit());
          dispatch(setReviewSliceInit());
          dispatch(setUserSliceInit());
          dispatch(setMapGroup());
          RootNavigation.reset([{ name: 'IntroScreen' }]);
        }}
      />
    </Screen>
  );
};

export default ProfileQuitScreen;

const styles = StyleSheet.create({
  container: {
    paddingTop: toSize(16),
    paddingHorizontal: toSize(16),
  },
  seperator: {
    height: toSize(24),
    backgroundColor: colors.ColorF5F5F5,
  },
  reasonBox: {
    flexDirection: 'row',
    marginTop: toSize(8),
    borderWidth: 1,
    borderColor: colors.ColorC1C1C1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: toSize(16),
    paddingVertical: toSize(12),
    borderRadius: 6,
  },
  icon: { width: toSize(14), height: toSize(14), marginRight: toSize(4) },
  btnContainer: {
    flexDirection: 'row',
    marginTop: toSize(42),
    justifyContent: 'space-between',
  },
  button: {
    marginVertical: toSize(14),
  },
  cancel: {
    width: toSize(165),
    alignItems: 'center',
    backgroundColor: colors.ColorF0FFF9,
    borderRadius: 6,
  },
  confirm: {
    width: toSize(165),
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 6,
  },
  reasonContainer: {
    marginTop: toSize(10),
  },
  reason: {
    marginHorizontal: toSize(16),
    borderBottomWidth: 1,
    borderColor: colors.ColorE5E5E5,
  },
  reasonText: {
    marginVertical: toSize(14),
  },
});
