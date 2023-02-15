import React, { useEffect, useRef, useState } from 'react';
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native';
import { colors, globalStyle, toSize } from '../../../config/globalStyle';
import AppText from '../../common/appText';
import { styles } from './styles';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import AppTouchable from '../../common/appTouchable';
import useInterval from '../../../hook/useInterval';

const CertificationView = ({
  login,
  timer,
  value,
  onChangeText,
  onPress,
  focus,
  warningMessage,
}) => {
  const [focused, setFocused] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (focus) {
      ref.current.focus();
    }
  }, [focus]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <AppText size={24} weight={'bold'}>
          문자 인증번호 입력
        </AppText>
        <View
          style={[
            globalStyle.textInputContainer,
            { marginTop: toSize(24) },
            focused
              ? { borderColor: colors.Color2D2F30 }
              : { borderColor: colors.ColorE5E5E5 },
            warningMessage && { borderColor: colors.ColorEC0000 },
          ]}
        >
          <BottomSheetTextInput
            testID={'BottomSheetTextInput'}
            ref={ref}
            value={value}
            placeholder={'6자리 입력'}
            onFocus={() => setFocused(true)}
            onEndEditing={() => setFocused(false)}
            placeholderTextColor={colors.ColorC4C4C4}
            onChangeText={onChangeText}
            style={styles.textInput}
            maxLength={6}
            keyboardType={'number-pad'}
            autoCorrect={false}
            autoCapitalize={'none'}
          />
        </View>

        <View style={styles.warn}>
          {warningMessage && (
            <AppText color={colors.ColorEC0000}>{warningMessage}</AppText>
          )}
        </View>

        {(timer || timer === 0) && (
          <AppText
            weight={'medium'}
            style={styles.time}
            color={colors.ColorA7A7A7}
            letterSpacing={0}
          >
            {timer > 0
              ? timer > 60
                ? timer > 120
                  ? `0:${(180 - timer).toString().padStart(2, 0)}`
                  : `1:${(120 - timer).toString().padStart(2, 0)}`
                : `2:${(60 - timer).toString().padStart(2, 0)}`
              : '3:00'}
          </AppText>
        )}

        <AppTouchable
          button
          style={[
            styles.confirmButton,
            {
              backgroundColor:
                value.length === 6 || timer === 180
                  ? colors.primary
                  : colors.ColorC4C4C4,
            },
          ]}
          disabled={timer === 180 ? false : value.length !== 6 ? true : false}
          onPress={onPress}
        >
          <AppText weight={'bold'} size={18} color={colors.white}>
            {timer === 180 ? '인증번호 다시받기' : '확인'}
          </AppText>
        </AppTouchable>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CertificationView;
