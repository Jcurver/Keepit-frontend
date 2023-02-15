import React, { memo, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { colors, fonts, toSize } from '../../../config/globalStyle';
import AppText from '../appText';

const AppTextArea = ({
  style,
  value,
  weight,
  onChangeText,
  textStyle,
  maximumInput, // 최대 입력 가능한 숫자 (박스 오른쪽 하단에 표시됩니다.)
  ...props
}) => {
  const [focused, setFocused] = useState(false);

  let fontFamily = '';
  if (weight === 'medium') {
    fontFamily = fonts.SpoqaHanSansNeo_Medium;
  } else if (weight === 'bold') {
    fontFamily = fonts.SpoqaHanSansNeo_Bold;
  } else {
    fontFamily = fonts.SpoqaHanSansNeo_Regular;
  }

  return (
    <View
      style={[
        styles.container,
        focused
          ? { borderColor: colors.Color2D2F30 }
          : { borderColor: colors.ColorE5E5E5 },
        style,
      ]}
    >
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={[
          styles.textInput,
          textStyle && textStyle,
          { fontFamily: fontFamily },
        ]}
        onFocus={() => setFocused(true)}
        onEndEditing={() => setFocused(false)}
        autoCorrect={false}
        autoCapitalize={'none'}
        multiline={true}
        maxLength={maximumInput}
        {...props}
      />
      {maximumInput && (
        <View style={styles.textContainer}>
          <AppText size={12} color={colors.ColorC4C4C4}>
            {value?.length ?? 0}
          </AppText>
          <AppText size={12} color={colors.ColorC4C4C4}>
            /{maximumInput}
          </AppText>
        </View>
      )}
    </View>
  );
};
export default memo(AppTextArea);

const styles = StyleSheet.create({
  container: {
    height: toSize(112),
    paddingTop: toSize(8),
    paddingHorizontal: toSize(14),
    paddingBottom: toSize(7),
    backgroundColor: colors.white,
    borderWidth: 1,
    borderRadius: 14,
    borderColor: colors.ColorE5E5E5,
  },
  textInput: {
    flex: 1,
    fontSize: toSize(14),
    color: colors.black,
    letterSpacing: 0,
    textAlignVertical: 'top',
    padding: 0,
  },
  textContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
  },
});
