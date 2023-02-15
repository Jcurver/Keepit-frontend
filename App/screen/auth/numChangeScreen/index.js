import React, { useState } from 'react';
import { isEmpty } from 'lodash';
import { View, Image } from 'react-native';
import AppText from '../../../component/common/appText';
import AppTouchable from '../../../component/common/appTouchable';
import AppHeader from '../../../component/common/appHeader';
import AppTextInput from '../../../component/common/appTextInput';
import AppTextArea from '../../../component/common/appTextArea';
import { colors, toSize, images } from '../../../config/globalStyle';
import RootNavigation from '../../../RootNavigation';
import Screen from '../../Screen';
import { styles } from './styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { postMembersInquiry } from '../../../api/user';
import { emailCheck } from '../../../function/validation';
import MyIcon from '../../../config/icon-font';
import Svg from '../../../asset/svg';

const NumChangeScreen = () => {
  const [email, setEmail] = useState();
  const [name, setName] = useState();
  const [place, setPlace] = useState();
  const [world, setWorld] = useState();
  const [etc, setEtc] = useState();
  const [emailError, setEmailError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [placeError, setPlaceError] = useState(false);
  const [groupError, setGroupError] = useState(false);
  const [buttonBlock, setButtonBlock] = useState('');

  const handleSubmit = () => {
    const apiData = { name, email, place, world, etc };
    postMembersInquiry(apiData).then((res) => {
      if (res.data.apiStatus.apiCode === 200) {
        RootNavigation.reset([{ name: 'ReceiveScreen' }]);
      }
    });
  };

  return (
    <Screen>
      <AppHeader
        leftIcon={Svg('back_thin')}
        leftIconPress={() => RootNavigation.goBack()}
        title={'휴대폰 번호 변경 문의'}
      />
      <KeyboardAwareScrollView
        extraScrollHeight={toSize(30)}
        keyboardShouldPersistTaps={'handled'}
      >
        <View style={styles.container}>
          <AppText weight={'medium'} style={{ marginTop: toSize(32) }}>
            고객센터 상담 시간
          </AppText>

          <AppText style={styles.common1}>
            평일 10:00 ~ 17:00 (주말, 공휴일 휴무)
          </AppText>

          <AppText style={{ marginTop: toSize(24) }}>
            *답변 받을 이메일 주소
          </AppText>

          <AppTextInput
            boxStyle={[
              styles.common1,
              emailError && { borderColor: colors.ColorFF0000 },
            ]}
            size={14}
            placeholder={'Value@gmail.com'}
            value={email}
            onChangeText={(text) => setEmail(text)}
            keyboardType={'email-address'}
            onBlur={() => {
              if (!emailCheck(email)) {
                setEmailError(true);
              } else {
                setEmailError(false);
              }
            }}
          />

          <View style={styles.error}>
            {emailError && (
              <AppText size={11} color={colors.ColorFF0000}>
                올바른 이메일 주소를 입력해주세요.
              </AppText>
            )}
          </View>

          <AppText weight={'medium'}>
            사용하던 계정에 대한 정보를 적어주세요.
          </AppText>

          <AppText style={{ marginTop: toSize(12) }}>*사용자 닉네임</AppText>

          <AppTextInput
            boxStyle={[
              styles.common1,
              nameError && { borderColor: colors.ColorFF0000 },
            ]}
            size={14}
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (text.length > 1) {
                setNameError(false);
              }
            }}
            placeholder={'사용자 닉네임을 적어주세요.'}
            keyboardType={'default'}
            maxLength={20}
            onBlur={() => {
              if (name?.length < 2) {
                setNameError(true);
              } else {
                setNameError(false);
              }
            }}
          />

          <View style={styles.error}>
            {nameError && (
              <AppText size={11} color={colors.ColorFF0000}>
                {name.length === 1
                  ? '사용자 이름은 2자이상 입력해주세요.'
                  : '필수 입력 항목입니다.'}
              </AppText>
            )}
          </View>

          <AppText>*최근에 작성한 장소</AppText>

          <AppTextArea
            style={[
              styles.placeSize,
              placeError && { borderColor: colors.ColorFF0000 },
            ]}
            placeholder={'글이 없을 경우 없음이라고 적어주세요.'}
            keyboardType={'default'}
            maximumInput={100}
            value={place}
            onChangeText={(text) => setPlace(text)}
            onBlur={() => {
              if (!place) {
                setPlaceError(true);
              } else {
                setPlaceError(false);
              }
            }}
          />

          <View style={styles.error}>
            {placeError && (
              <AppText size={11} color={colors.ColorFF0000}>
                필수 입력 항목입니다.
              </AppText>
            )}
          </View>

          <AppText>*속한 그룹 이름</AppText>

          <AppTextInput
            boxStyle={[
              styles.common1,
              groupError && { borderColor: colors.ColorFF0000 },
            ]}
            value={world}
            onChangeText={(text) => setWorld(text)}
            size={14}
            placeholder={'그룹이 없을 경우 없음이라고 적어주세요.'}
            keyboardType={'default'}
            maxLength={100}
            onBlur={() => {
              if (!world) {
                setGroupError(true);
              } else {
                setGroupError(false);
              }
            }}
          />

          <View style={styles.error}>
            {groupError && (
              <AppText size={11} color={colors.ColorFF0000}>
                필수 입력 항목입니다.
              </AppText>
            )}
          </View>

          <AppText>기타 문의 내용</AppText>

          <AppTextArea
            style={styles.ectSize}
            placeholder={'문의내용을 입력해주세요.'}
            keyboardType={'default'}
            value={etc}
            onChangeText={(text) => setEtc(text)}
            maximumInput={200}
          />

          <AppTouchable
            button
            style={[
              styles.queryButton,
              (isEmpty(email) ||
                isEmpty(name) ||
                isEmpty(place) ||
                isEmpty(world) ||
                emailError ||
                nameError ||
                placeError ||
                groupError ||
                buttonBlock) && {
                backgroundColor: colors.ColorC4C4C4,
              },
            ]}
            disabled={
              isEmpty(email) ||
              isEmpty(name) ||
              isEmpty(place) ||
              isEmpty(world) ||
              emailError ||
              nameError ||
              placeError ||
              groupError ||
              buttonBlock
            }
            onPress={() => {
              handleSubmit();
            }}
          >
            <AppText weight={'bold'} size={18} color={colors.white}>
              문의하기
            </AppText>
          </AppTouchable>
        </View>
      </KeyboardAwareScrollView>
    </Screen>
  );
};

export default NumChangeScreen;
